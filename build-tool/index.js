const _ = require('underscore-mixin');
const Composition = require('./lib/composition.js');
const DockerCompose = require('./lib/docker-compose.js');
const Queue = require('./lib/queue.js');
const ApplicationSchema = require('./lib/application-schema.js');
const fs = require('fs');
const os = require('os');

// const through2 = require('through2');
// const plumber = require('gulp-plumber');
// const vfs = require('vinyl-fs');
// const named = require('vinyl-named');

module.exports = class BuildTool {
    constructor(params) {
        this._params = params;
        this.buildNext = this.buildNext.bind(this);
        this.buildImagesNext = this.buildImagesNext.bind(this);
        this.compositionRestartNext = this.compositionRestartNext.bind(this);
        this.logGrepNext = this.logGrepNext.bind(this);
    }

    prepare() {
        this.makeStartupTask();
        this.makeWatchCompositionTask();
        this.makeApplicationWatchTasks();

        this.hangOnSigInt();
        this.spinUpBuildLoop();
        this.spinUpBuildImagesLoop();
        this.spinUpCompositionRestartLoop();

        if (this.getParams().dockerLogsPolling) {
            this.spinUpLogGrepLoop();
        }

        return [
            this.getStartupTaskName(),
            this.getWatchCompositionTaskName(),
            ...this.getWatchTaskNames(),
        ];
    }

    getStartupTaskName() {
        return 'startup';
    }

    getWatchCompositionTaskName() {
        return 'watch-composition';
    }

    getWatchTaskName(appCode, taskCode) {
        return `watch-${appCode}-${taskCode}`;
    }

    getWatchTaskNames() {
        const names = [];

        const schema = this.getApplicationSchema();
        _.forEach(this.getComposition().getDevApps(), (declaration, code) => {
            const app = schema.getApplication(code);
            if (!app) {
                throw new Error(`For application "${code}" there is no build controller specified.`);
            }

            app.getTaskSchema().forEach((task) => {
                names.push(this.getWatchTaskName(app.getAppCode(), task.code));
            });
        });

        return names;
    }

    makeStartupTask() {
        this.getGulp().task(this.getStartupTaskName(), (cb) => {
            const q = this.getBuildQueue();

            // put all tasks of all apps to the queue, in order to build it
            q.lock();
            this.getApplicationSchema().getTaskGlobalCodes().forEach((code) => {
                q.push(code);
            });
            q.unlock();

            cb();
        });
    }

    makeWatchCompositionTask() {
        this.getGulp().task(this.getWatchCompositionTaskName(), () => {
            this.getGulp().watch([
                this.getDockerComposeFilePath(),
            ], () => {
                this.orderToRestartComposition();
            });
        });
    }

    makeApplicationWatchTasks() {
        const gulp = this.getGulp();
        const schema = this.getApplicationSchema();

        _.forEach(this.getComposition().getDevApps(), (declaration, code) => {
            const app = schema.getApplication(code);
            if (!app) {
                throw new Error(`For application "${code}" there is no build controller attached.`);
            }

            app.getTaskSchema().forEach((task) => {
                gulp.task(this.getWatchTaskName(app.getAppCode(), task.code), () => {
                    gulp.watch(app.getWatchFiles(task.code), {follow: true}, () => {
                        this.orderToBuild(app.getAppCode(), task.code);
                    });
                });
            });
        });
    }

    orderToBuild(appCode, taskCode) {
        const q = this.getBuildQueue();
        q.push({appCode, taskCode});
    }

    getApplicationSchema() {
        if (!this._as) {
            const schema = new ApplicationSchema(this);
            const composition = this.getComposition();

            // filter through the existing applications
            _.forEach(schema.getApplications(), (app) => {
                const code = app.getAppCode();
                if (!composition.hasApplication(code)) {
                    console.dir(`Application "${code}" is not described in the composition, skipping.`);
                    schema.removeApplication(code);
                }
            });

            this._as = schema;
        }

        return this._as;
    }

    getComposition() {
        if (!this._composition) {
            this._composition = new Composition(this.getDockerComposeFilePath());
        }

        return this._composition;
    }

    getDockerCompose() {
        if (!this._dockerCompose) {
            this._dockerCompose = new DockerCompose(this);
        }

        return this._dockerCompose;
    }

    getBuildQueue() {
        if (!this._buildQueue) {
            this._buildQueue = new Queue();
        }

        return this._buildQueue;
    }

    getBuildImagesQueue() {
        if (!this._buildImagesQueue) {
            this._buildImagesQueue = new Queue();
        }

        return this._buildImagesQueue;
    }

    getCompositionRestartQueue() {
        if (!this._compositionRestartQueue) {
            this._compositionRestartQueue = new Queue();
        }

        return this._compositionRestartQueue;
    }

    getGulp() {
        return this.getParams().gulp || null;
    }

    getDockerComposeFilePath() {
        return this.getParams().composeFile;
    }

    getApplicationClasses() {
        return this.getParams().applications || {};
    }

    getParams() {
        return this._params || {};
    }

    spinUpBuildLoop() {
        this._buildLoop = setTimeout(this.buildNext, 300);
    }

    spinUpBuildImagesLoop() {
        this._buildImagesLoop = setTimeout(this.buildImagesNext, 300);
    }

    spinUpCompositionRestartLoop() {
        this._compositionRestartLoop = setTimeout(this.compositionRestartNext, 300);
    }

    spinUpLogGrepLoop() {
        this._logGrepLoop = setTimeout(this.logGrepNext, this.getParams().dockerLogsPollingInterval || 1000);
    }

    buildNext() {
        const bq = this.getBuildQueue();
        const biq = this.getBuildImagesQueue();

        const next = () => {
            if (!this._haltBuild) {
                this.spinUpBuildLoop();
            }
        };

        if (bq.isLocked()) {
            next();
            return;
        }

        if (bq.isEmpty()) {
            biq.unlock();
            next();
            return;
        }

        const all = bq.popAll();

        this.log('>>> Rebuilding sources');
        Promise.all(this.getApplicationSchema().executeBuilds(all)).then(() => {
            this.log(`>>> Done (${all.map((task) => { return `${task.appCode}:${task.taskCode}`; }).join(', ')})`);
            biq.pushAll(_.pluck(all, 'appCode'));
            next();
        }).catch(() => {
            // =(
            next();
        });
    }

    buildImagesNext() {
        const next = () => {
            if (!this._haltBuild) {
                this.spinUpBuildImagesLoop();
            }
        };

        const biq = this.getBuildImagesQueue();

        if (biq.isLocked()) {
            next();
            return;
        }

        if (biq.isEmpty()) {
            // start re-compose
            next();
            return;
        }

        const all = biq.popAll();
        biq.lock();

        this.log('>>> Rebuilding images');
        Promise.all(this.getDockerCompose().buildAll(all)).then(() => {
            this.log(`>>> Done (${all.join(', ')})`);
            this.orderToRestartComposition();
            next();
        }).catch(() => {
            // =(
            next();
        });
    }

    compositionRestartNext() {
        const crq = this.getCompositionRestartQueue();

        const next = () => {
            if (!this._haltBuild) {
                this.spinUpCompositionRestartLoop();
            }
        };

        if (crq.isEmpty()) {
            next();
            return;
        }

        crq.popAll(); // just wipe out the queue

        this.log('>>> Restarting composition');
        this.getDockerCompose().restart().then(() => {
            this.log('>>> Done');
            next();
        }).catch(() => {
            this.log('Error: was not able to restart the composition');
        });
    }

    async logGrepNext() {
        const next = () => {
            if (!this._haltBuild) {
                this.spinUpLogGrepLoop();
            }
        };

        // todo: polling sucks, invent something more clever
        // todo: e.g. https://www.syslog-ng.com/community/b/blog/posts/collecting-logs-containers-using-docker-volumes/

        const schema = this.getApplicationSchema();
        const compose = this.getDockerCompose();

        for (let i = 0; i < schema.getLength(); i++) {
            const app = schema.get(i);
            const code = app.getAppCode();
            this.log(await compose.getLogs(code, this.getLastPolled(code)), {tag: code});
            this.setLastPolled(code);
        }

        next();
    }

    setLastPolled(code) {
        this._lastPolled = this._lastPolled || {};
        // todo: this is inaccurate, because it relies on local time
        this._lastPolled[code] = this.getNow();
    }

    getLastPolled(code) {
        this._lastPolled = this._lastPolled || {};
        return this._lastPolled[code] || null;
    }

    getNow() {
        return Math.round((new Date()).getTime() / 1000);
    }

    orderToRestartComposition() {
        this.getCompositionRestartQueue().push('have-you-tried-to-switch-off-and-on-again');
    }

    hangOnSigInt() {

        const halt = () => {
            process.exit(0);
        };
        const stop = () => {
            this._haltBuild = true;
            this.getBuildQueue().lock();

            return this.closeStreams().then(() => {
                halt();
            });
        };

        process.on('SIGINT', () => {
            this.getDockerCompose().stop().then(() => {
                this.log('>>> Bye-bye');
                return stop();
            }).catch(() => {
                this.log('>>> Error while exiting');
                halt();
            });
        });
    }

    log(data, params = {}) {
        if (data) {
            params = params || {};
            if (_.isStringNotEmpty(params.tag)) {
                // write to the "tagged" pipe
                this.getStream(params.tag).write(data);
            } else {
                // write to the "common" output
                console.log(data.toString().replace(/(\r\n|\r|\n)+$/g, ''));
            }
        }
    }

    putStats(stats, params = {}) {
        if (stats) {
            params = params || {};
            if (_.isStringNotEmpty(params.tag)) {
                // write to the "tagged" pipe
                const objKey = `${params.tag}-stats`;
                this.getStream(params.tag, 'build-tool-stats', objKey).write(JSON.stringify(stats.toJson({
                    assets: true,
                    hash: true,
                })));
            }
        }
    }

    getStream(tag, subFolder = 'build-tool-output', objKey = null) {
        this._streams = this._streams || {};
        objKey = objKey || tag;
        if (!this._streams[objKey]) {

            const folder = `${os.tmpdir()}/${subFolder}`;
            const path = `${folder}/${tag}`;

            try {
                fs.mkdirSync(folder);
            } catch (e) {
                // i hope it failed because of an existence :)
            }

            try {
                fs.openSync(path, 'w'); // (create or truncate) + writing
            } catch (e) {
                // i hope it wont fail ever :)
            }

            this._streams[objKey] = fs.createWriteStream(path);
        }

        return this._streams[objKey];
    }

    async closeStreams() {
        let toWait = [];

        if (_.isObjectNotEmpty(this._streams)) {
            toWait = Object.values(this._streams).map((stream) => {
                return new Promise((resolve) => {
                    stream.end('', resolve);
                });
            });
        }

        return Promise.all(toWait);
    }
};
