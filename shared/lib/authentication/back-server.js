export default class BackServer {
    constructor(params = {}) {
        this._params = params;
    }

    attach() {}

    getParams() {
        return this._params || {};
    }

    getPasswordField() {
        return 'profile.password';
    }

    getLoginField() {
        return 'profile.email';
    }
}
