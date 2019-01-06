/**
 * This class is used client-side to enable integration with OAuth2
 */

import jwt from 'jsonwebtoken';
import axios from 'axios';

export default class WebClientAuthentication {
    constructor(params = {}) {
        this._params = params;
    }

    attach() {
        const { network } = this.getParams();

        network.mixins.push(service => {
            service.hooks({
                before: async hook => {
                    Object.assign(hook.params, {
                        accessToken: await this.getToken(),
                    });
                },
            });
        });

        if (network.rest) {
            network.mixins.push(service => {
                service.hooks({
                    before: hook => {
                        hook.params.headers = Object.assign(
                            {},
                            {
                                Authorization: `Bearer ${
                                    hook.params.accessToken
                                }`,
                            },
                            hook.params.headers,
                        );
                    },
                });
            });
        }
    }

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

    async signInLocal(params) {}

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
            window.authAgent.once('login', resolve);
        });

        await this.storeToken(token);
        window.__authAgentPrevReject = null;

        return this.getUserId(token, false);
    }

    async decodeToken(token, verify = true) {
        if (!_.isStringNotEmpty(token)) {
            return null;
        }

        const { settings } = this.getParams();

        if (verify) {
            return axios
                .post(`${settings.get('url.auth.outer')}verify`, {
                    token,
                })
                .then(response => response.data)
                .catch(() => null);
        } else {
            return jwt.decode(token);
        }
    }

    async isTokenValid(token) {
        return _.isObjectNotEmpty(await this.decodeToken(token, true));
    }

    async getToken() {
        const storage = await this.getStorage();
        return storage.getItem('auth');
    }

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

    async getUserId(token, verify = true) {
        const payload = await this.decodeToken(token, verify);
        if (_.isObjectNotEmpty(payload)) {
            return payload.userId || null;
        }

        return null;
    }

    async getUser(token, validate = true) {
        if (!token) {
            token = await this.getToken();
        }

        const userId = await this.getUserId(token, validate);
        const { userEntity } = this.getParams();
        if (userId) {
            return userEntity.get(userId);
        }

        return null;
    }

    async getUserById(id) {
        const { userEntity } = this.getParams();
        return userEntity.get(id);
    }
}
