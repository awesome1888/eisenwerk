import errors from '@feathersjs/errors';

export default class Method {
    static getDeclaration() {
        return [
            // // example:
            // {
            //     name: 'candidate.activate',
            //     body: 'activateCandidate',
            //     access: {
            //         deny: false,
            //         authorized: true,
            //         roleAll: [roleEnum.PRE_CANDIDATE],
            //     },
            // }
        ];
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

    /**
     * Just a short-cut.
     * @returns {*}
     */
    getAuthorization() {
        return this.getApplication().getAuthorization();
    }

    async getUser() {
        return this.getAuthorization().getUserByContext(this.getContext());
    }

    static throw403(message = '') {
        throw new errors.Forbidden(_.isStringNotEmpty(message) ? message : 'Forbidden');
    }
}
