const _ = require('underscore-mixin');

module.exports = class ApplicationSchema {
    constructor(tool) {
        this._tool = tool;
    }

    getApplications() {
        if (!this._apps) {
            this._apps = {};

            _.forEach(this.getTool().getApplicationClasses(), (AppClass, code) => {
                this._apps[code] = new AppClass(this.getTool(), code);
            });
        }

        return this._apps;
    }

    getApplication(code) {
        return this.getApplications()[code] || null;
    }

    forEach(cb) {
        return Object.values(this.getApplications()).forEach(cb);
    }

    get(ix) {
        return Object.values(this.getApplications())[ix];
    }

    getLength() {
        return Object.keys(this.getApplications()).length;
    }

    /**
     *
     * @param which
     * @returns {[Promise]}
     */
    executeBuilds(which) {
        if (!_.isArrayNotEmpty(which)) {
            return [];
        }

        return which.map((action) => {

            const appCode = action.appCode;
            const taskCode = action.taskCode;

            // todo: move this code to the Application entity
            const app = this.getApplication(appCode);
            app.makeDstFolder();

            const b = app.getBuilder(taskCode);

            return app.installNPM(taskCode).then(() => {
                return b(app.getTask(taskCode));
            }).catch((e) => {
                this.getTool().log(`>>> Build sources failed for: ${appCode} (run "./script/log.sh ${appCode}" to see the details)`);
                throw e;
            });
        });
    }

    getTaskGlobalCodes() {
        const codes = [];

        Object.values(this.getApplications()).forEach((app) => {
            app.getTaskSchema().forEach((task) => {
                codes.push({
                    appCode: app.getAppCode(),
                    taskCode: task.code,
                });
            });
        });

        return codes;
    }

    getTool() {
        return this._tool;
    }

    removeApplication(code) {
        delete this._apps[code];
    }
};
