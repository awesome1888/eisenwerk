const _ = require('underscore-mixin');
const path = require('path');
const fs = require('fs');
const Util = require('./util.js');
const areFilesEqual = require('fs-equal').areFilesEqual;
const copyFilesSync = require('fs-copy-file-sync');

module.exports = class Application {
    constructor(tool, appCode) {
        this._tool = tool;
        this._appCode = appCode;
    }

    getTool() {
        return this._tool;
    }

    getAppCode() {
        return this._appCode;
    }

    getTaskSchema() {
        return [];
    }

    getTask(code) {
        return this.getTaskSchema().find((task) => {
            return task.code === code;
        });
    }

    getBuilder(taskCode) {
        return this.getTask(taskCode).build || null;
    }

    getWatchFiles(taskCode) {
        return this.getTask(taskCode).watch || [];
    }

    getComposition() {
        return this.getTool().getComposition().getDevApps()[this.getAppCode()];
    }

    getRootFolder() {
        const app = this.getComposition();
        const context = app.build.context;
        const composeFile = this.getTool().getDockerComposeFilePath();
        const composeDir = path.dirname(composeFile);

        return `${composeDir}/${context}`;
    }

    getDockerfilePath() {
        const root = this.getRootFolder();
        const dockerfile = this.getComposition().build.dockerfile;

        return `${root}/${dockerfile}`;
    }

    getSrcFolder() {
        return `${this.getRootFolder()}/src`;
    }

    getDstFolder() {
        return `${this.getRootFolder()}/build`;
    }

    makeDstFolder() {
        const dst = this.getDstFolder();
        try {
            fs.mkdirSync(dst);
        } catch(e) {
        }
    }

    async installNPM(taskCode) {
        const task = this.getTask(taskCode);
        const folder = task.folder || this.getRootFolder();
        const file = `${folder}/package.json`;
        const fileLock = `${folder}/.packagejsonprev`;

        let equal = false;
        try {
            equal = await areFilesEqual(file, fileLock);
        } catch(e) {
        }

        if (!equal) {
            return Util.execute('npm', ['--prefix', folder, 'install', '--save'], {
                tool: this.getTool(),
                tag: this.getAppCode(),
            }).then(() => {
                // copy file
                // todo: replace with async later
                copyFilesSync(file, fileLock);
            });
        }
    }

    log(data, tag = null) {
        tag = tag || this.getAppCode();
        return this.getTool().log(data, {tag});
    }

    logWebpack(data, stats, task = null) {
        this.log("\n\n##################\n# WEBPACK OUTPUT #\n##################\n\n");
        this.log(data);

        if (task && task.debugBundle) {
            this.getTool().putStats(stats, {tag: `${this.getAppCode()}:${task.code}`});
        }
    }

    logWebpackComplex(err, stats, resolve, reject, task = null) {
        if (err || stats.hasErrors()) {
            this.logWebpack(stats.toString('errors-only'), stats, task);
            reject(err);
        } else {
            this.logWebpack(stats.toString('minimal'), stats, task);
            resolve();
        }
    }
};
