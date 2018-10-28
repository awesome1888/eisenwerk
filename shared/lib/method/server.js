import Context from '../context';

export default class Method {
    static getDeclaration() {
        return [];
    }

    getContext() {
        return this._ctx || null;
    }

    setContext(ctx) {
        this._ctx = ctx;
    }

    getApplication() {
        return this._app || null;
    }

    setApplication(app) {
        this._app = app;
    }

    async getUser() {
        return Context.extractUser(this.getContext(), this.getApplication().getAuthorization());
    }
}
