import errors from '@feathersjs/errors';

export default class Error {
    static throw400(message = '') {
        throw new errors.GeneralError(_.isStringNotEmpty(message) ? message : 'Internal error');
    }

    static throw403(message = '') {
        throw new errors.Forbidden(_.isStringNotEmpty(message) ? message : 'Forbidden');
    }
}
