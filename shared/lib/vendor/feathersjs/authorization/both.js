import errors from '@feathersjs/errors';

export default class Authorization {
    /**
     * Specifies what field is used to store user login
     * @returns {string}
     */
    // todo: rename to getUserLoginField
    static getLoginField() {
        return 'profile.email';
    }

    /**
     * Specifies what field is used to store user password for a local auth strategy
     * @returns {string}
     */
    static getPasswordField() {
        return 'profile.password';
    }

    /**
     * @param network A reference to featherjs client instance
     * @param settings A reference to the settings (provides .isProduction() and .getRootURL() methods)
     * @param userEntity
     */
    constructor(network, settings = null, userEntity = null) {
        this._network = network;
        this._settings = settings || null;
        this._userEntity = userEntity || null;
    }

    getLoginField() {
        return this.constructor.getLoginField();
    }

    getPasswordField() {
        return this.constructor.getPasswordField();
    }

    getSettings() {
        return this._settings;
    }

    getNetwork() {
        return this._network;
    }

    /**
     * Authenticate a user with login and password, returns user id
     * @param login
     * @param password
     * @returns {Promise<*>}
     */
    async signInLocal(login, password) {
        const response = await this.getNetwork().authenticate({
            strategy: 'local',
            [this.getLoginField()]: login,
            [this.getPasswordField()]: password,
        });

        return this.getUserId(response.accessToken);
    }

    /**
     * Cancel current authorization
     * @returns {Promise<*>}
     */
    async signOut() {
        return this.getNetwork().logout();
    }

    async sendResetPassword(email) {
        const authManagement = this.getNetwork().service('authManagement');
        return authManagement.create({
            action: 'sendResetPwd',
            value: {
                'profile.email': email,
            },
            // notifierOptions: {
            //     preferredComm: 'email'
            // },
        });
    }

    async resetPassword(token, password) {
        const authManagement = this.getNetwork().service('authManagement');
        return authManagement.create({
            action: 'resetPwdLong',
            value: {
                token, // compares to .resetToken
                password, // new password
            },
        });
    }

    async changePassword(email, oldPassword, password) {
        const authManagement = this.getNetwork().service('authManagement');
        return authManagement.create({
            action: 'passwordChange',
            value: {
                user: {
                    'profile.email': email,
                },
                oldPassword,
                password, // new password
            },
        });
    }

    async changeEmail(password, oldEmail, newEmail) {
        const authManagement = this.getNetwork().service('authManagement');
        return authManagement.create({
            action: 'identityChange',
            value: {
                password,
                changes: {
                    'profile.email': newEmail,
                },
                user: {
                    'profile.email': oldEmail,
                },
            },
        });
    }

    async checkEmail(email, ownId) {
        const authManagement = this.getNetwork().service('authManagement');
        return authManagement.create({
            action: 'checkUnique',
            value: {
                'profile.email': email,
            },
            ownId,
        });
    }

    /**
     * Returns the token stored in the storage (see .prepare() to change the type of the storage),
     * or takes the provided one and checks if the token is valid.
     * This function does the remote call.
     * @returns {Promise<*>}
     */
    async getToken(validityCheck = true) {
        const token = await this.getNetwork().passport.getJWT();
        if (_.isStringNotEmpty(token)) {
            if (validityCheck !== false) {
                if (await this.isTokenValid(token)) {
                    return token;
                }
            } else {
                return token;
            }
        }

        return null;
    }

    /**
     * Get token payload, if it is valid.
     * The function makes the remote call.
     * @param token
     * @returns {Promise<*>}
     */
    async extractPayload(token) {
        if (!_.isStringNotEmpty(token)) {
            token = await this.getToken(false);
        }

        if (!_.isStringNotEmpty(token)) {
            return null;
        }

        return this.getNetwork().passport.verifyJWT(token);
    }

    async isTokenValid(token) {
        throw new Error('Not implemented');
    }

    /**
     * Extract the user id from the payload (the data encrypted in the token)
     * @param token
     * @returns {Promise<*>}
     */
    async getUserId(token) {
        const payload = await this.extractPayload(token);
        if (!_.isObjectNotEmpty(payload)) {
            return null;
        }

        return payload.userId;
    }

    /**
     * Get user by their token
     * @param token
     * @returns {Promise<*>}
     */
    async getUserByToken(token = null) {
        if (!this._userEntity) {
            return null;
        }

        const id = await this.getUserId(token);
        if (!id) {
            return null;
        }

        return this.getUser(id);
    }

    /**
     * Get user by their id
     * @param id
     * @returns {Promise<*>}
     */
    async getUser(id = null) {
        if (!this._userEntity) {
            return null;
        }

        let u = null;
        try {
            u = await this._userEntity.get(id);
        } catch (e) {
            if (e instanceof errors.NotFound) {
                u = null;
            } else {
                throw e;
            }
        }

        return u;
    }
}
