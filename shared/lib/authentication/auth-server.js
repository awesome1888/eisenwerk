export default class AuthServer {
    constructor(params = {}) {
        this._params = params;
    }

    prepare() {}

    getParams() {
        return this._params || {};
    }
}
