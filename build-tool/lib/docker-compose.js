const exec = require('child_process').exec;
const _ = require('underscore-mixin');
const Util = require('./util.js');

module.exports = class DockerCompose {

    constructor(tool) {
        this._tool = tool;
        this.invalidateCache();
    }

    invalidateCache() {
        this._cache = {};
        this.invalidateIdCache();
    }

    invalidateIdCache() {
        this._cache.ids = {};
    }

    getParams() {
        return this.getTool().getParams();
    }

    start(args = []) {
        if (!_.isArray(args)) {
            args = [];
        }
        return this.executeCompose(['up', '-d', ...args]).then(() => {
            this.invalidateIdCache();
        });
    }

    restart() {
        return this.start();
    }

    stop() {
        return this.executeCompose(['stop']);
    }

    executeBuild(appCode) {
        const image = this.getApplicationImageName(appCode);
        const tool = this.getTool();
        const app = tool.getApplicationSchema().getApplication(appCode);

        return this.execute('docker', ['build', '-t', image, '-f', app.getDockerfilePath(), app.getRootFolder()], {tag: appCode}).catch((e) => {
            this.getTool().log(`>>> Build image failed for: ${appCode} (run "./script/log.sh ${appCode}" to see the details)`);
            throw e;
        });
    }

    buildAll(all) {
        return all.map((image) => {
            return this.executeBuild(image);
        });
    }

    async getLogs(appCode, since = null) {
        const id = await this.getContainerId(appCode);
        if (!_.isStringNotEmpty(id)) {
            return '';
        }

        return new Promise((resolve) => {
            exec(`docker logs ${since !== null ? `--since ${since}` : ''} ${id}`, (err, stdout, stderr) => {
                if (err) {
                    resolve('');
                } else {
                    // todo: this sucks because lines of stdout and stderr can be mixed up in real life
                    resolve(`${stdout}${stderr}`);
                    // resolve(stderr);
                }
            });
        });
    }

    async getContainerId(appCode) {
        if (this._cache.ids[appCode]) {
            return this._cache.ids[appCode];
        }

        return new Promise((resolve) => {
            exec(`docker ps | grep docker_${appCode}`, (err, stdout) => {
                if (err) {
                    resolve('');
                } else {
                    const id = stdout.toString().split(/\s/)[0];

                    if (_.isStringNotEmpty(id)) {
                        this._cache.ids[appCode] = id;
                    }
                    resolve(id);
                }
            });
        });
    }

    executeCompose(args = []) {
        if (!_.isArray(args)) {
            args = [];
        }
        return this.execute('docker-compose', ['-f', this.getTool().getDockerComposeFilePath(), ...args]);
    }

    execute(cmd, args = [], params = {}) {
        return Util.execute(
            cmd,
            args,
            {
                tool: this.getTool(),
                exposeCLI: this.getParams().exposeCLI,
                ...params,
            }
        );
    }

    getTool() {
        return this._tool;
    }

    getApplicationImageName(code) {
        return `docker_${code}`;
    }
};
