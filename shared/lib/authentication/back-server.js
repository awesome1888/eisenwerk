export default class BackServer {
    constructor(params = {}) {
        this._params = params;
    }

    prepare() {}

    getParams() {
        return this._params || {};
    }
}
