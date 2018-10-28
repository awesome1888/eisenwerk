import errors from '@feathersjs/errors';

export default class Error {

    static get400(message = '') {
        return new errors.GeneralError(_.isStringNotEmpty(message) ? message : 'Internal error');
    }

    static throw400(message = '') {
        throw this.get400(message);
    }

    static get401(message = '') {
        throw new errors.NotAuthenticated(_.isStringNotEmpty(message) ? message : 'Not Authenticated');
    }

    static throw401(message = '') {
        throw this.get401(message);
    }

    static get403(message = '') {
        throw new errors.Forbidden(_.isStringNotEmpty(message) ? message : 'Forbidden');
    }

    static throw403(message = '') {
        throw this.get403(message);
    }
}
