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
        const response = await this.getNetwork()
            .getApp()
            .authenticate({
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
     * Returns token. This function is more complex in the client-side implementation.
     * @returns {Promise<*>}
     */
    async getToken(token) {
        return _.isStringNotEmpty(token) ? token : null;
    }

    /**
     * Get token payload, if it is valid.
     * The function makes the remote call.
     * @param token
     * @returns {Promise<*>}
     */
    async extractPayload(token) {
        token = await this.getToken(token);
        if (!token) {
            return null;
        }

        return this.getNetwork()
            .getApp()
            .passport.verifyJWT(token);
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
}
