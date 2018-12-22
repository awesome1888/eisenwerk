/**
 * This class is used on the side of API server
 */

import jwt from 'jsonwebtoken';

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

    async decodeToken(token, verify = true) {
        if (!_.isStringNotEmpty(token)) {
            return null;
        }

        const { settings } = this.getParams();

        if (verify) {
            return new Promise(resolve => {
                jwt.verify(
                    token,
                    settings.get('auth.secret'),
                    (err, decoded) => {
                        resolve(err ? null : decoded);
                    },
                );
            });
        } else {
            return jwt.decode(token);
        }
    }

    async isTokenValid(token) {
        return _.isObjectNotEmpty(await this.decodeToken(token, true));
    }
}
