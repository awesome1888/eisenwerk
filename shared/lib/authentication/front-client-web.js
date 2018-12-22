/**
 * This class is used client-side to enable integration with OAuth2
 */

export default class FrontClientWeb {
    constructor(params = {}) {
        this._params = params;
    }

    attach() {}

    getParams() {
        return this._params || {};
    }

    async signIn(how = 'local', params = {}) {
        if (!_.isStringNotEmpty(how)) {
            throw new Error('Illegal way of authorizing');
        }

        if (how === 'local') {
            return this.signInLocal(params);
        }

        return this.signInOAuth2(how, params);
    }

    async signOut() {
        this.storeToken();
    }

    async signInLocal() {}

    async signInOAuth2(how) {
        const openLoginPopup = (await import('feathers-authentication-popups'))
            .default;
        openLoginPopup(`/auth/${how}`, {
            width: 600,
            height: 600,
        });

        if (_.isFunction(window.__authAgentPrevReject)) {
            window.__authAgentPrevReject(new Error('ABANDONED_WINDOW'));
            window.__authAgentPrevReject = null;
        }

        const token = await new Promise((resolve, reject) => {
            window.__authAgentPrevReject = reject;
            window.authAgent.once('login', resToken => {
                resolve(resToken);
            });
        });

        await this.storeToken(token);
        window.__authAgentPrevReject = null;

        // const userId = await this.getUserId(token);
        // return userId;
    }

    async decodeToken(token, validate = true) {}

    async storeToken(token = null) {
        const storage = await this.getStorage();
        storage.setItem('auth', token);
    }

    async cleanUpToken() {
        return this.storeToken(undefined);
    }

    async getStorage() {
        if (!this._storage) {
            if (!window) {
                const Storage = (await import('node-storage-shim')).default;
                this._storage = new Storage();
            } else {
                this._storage = window.localStorage;
            }
        }

        return this._storage;
    }
}
