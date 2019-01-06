/**
 * This class is used on the side of API server
 */

import jwt from 'jsonwebtoken';

export default class APIServerAuthentication {
    constructor(params = {}) {
        this._params = params;
    }

    attach() {
        // tune user entity
    }

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
                    new Buffer(settings.get('auth.secret'), 'utf8'),
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

    async getUserId(token, verify = true) {
        const payload = await this.decodeToken(token, verify);
        if (_.isObjectNotEmpty(payload)) {
            return payload.userId || null;
        }

        return null;
    }

    async getUser(token, validate = true) {
        const userId = await this.getUserId(token, validate);
        const { userEntity } = this.getParams();
        if (userId) {
            return userEntity.get(userId);
        }

        return null;
    }
}
