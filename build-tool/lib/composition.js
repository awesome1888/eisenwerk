const readYaml = require('read-yaml');
const _ = require('underscore-mixin');

module.exports = class Composition {
    constructor(compositionPath) {
        this._path = compositionPath;
    }

    getDockerComposeFilePath() {
        return this._path || '';
    }

    getData() {
        if (!this._data) {
            this._data = readYaml.sync(this.getDockerComposeFilePath(), {});
        }

        return this._data;
    }

    getDevApps() {
        if (!this._devApps) {
            const services = this.getData().services || {};

            const result = {};
            if (_.isObjectNotEmpty(services)) {
                _.forEach(services, (struct, key) => {
                    if (
                        _.isObjectNotEmpty(struct.build)
                        &&
                        _.isStringNotEmpty(struct.build.context)
                        &&
                        _.isStringNotEmpty(struct.build.dockerfile)
                    ) {
                        const item = _.deepClone(struct);
                        item.__code = key;

                        result[key] = item;
                    }
                });
            }

            this._devApps = result;
        }

        return this._devApps;
    }

    hasApplication(code) {
        return !!this.getDevApps()[code];
    }

    // getAppCodes() {
    //     return Object.keys(this.getDevApps());
    // }
};

