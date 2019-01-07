/**
 * This is a typical interface for a web server
 */

import settings from '../../lib/settings/server';

export default class Server {
    constructor(params) {
        this._params = params;
    }

    async launch() {}

    getParams() {
        return this._params;
    }

    getSettings() {
        return settings;
    }

    tearDown() {
        process.exit(1);
    }
}