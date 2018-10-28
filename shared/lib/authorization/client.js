import auth from '@feathersjs/authentication-client';
import AuthorizationBoth from './both.js';
import openLoginPopup from 'feathers-authentication-popups';

import User from '../../entity/user/entity/client.js';

export default class Authorization extends AuthorizationBoth {

    /**
     * Tune feathersjs client app with appropriate configuration.
     * @param app
     */
    static prepare(app) {
        app.configure(auth({
            // todo: use custom storage in order to obtain the token either from localStorage or the URL
            storage: window.localStorage,
        }));
    }

    /**
     * Authenticate a user through oauth2 Google.
     * @returns {Promise<*>}
     */
    async signInThroughGoogle() {
        const ctx = this.getSettings();

        openLoginPopup(`${ctx.getAPIURL()}/auth/google`, {
            width: 600,
            height: 600,
        });

        if (_.isFunction(window.__authAgentPrevReject)) {
            window.__authAgentPrevReject(new Error('ABANDONED_WINDOW'));
            window.__authAgentPrevReject = null;
        }

        const token = await new Promise((resolve, reject) => {
            window.__authAgentPrevReject = reject;
            window.authAgent.once('login', (resToken) => {
                resolve(resToken);
            });
        });

        this.getNetwork().passport.setJWT(token);
        window.__authAgentPrevReject = null;

        const userId = await this.getUserId(token);
        this.getNetwork().emit('authenticated');

        return userId;
    }

    /**
     * Checks if the current user is authorized and the token is valid.
     * This function does the remote call.
     * @returns {Promise<*>}
     */
    async isAuthorized() {
        return this.getToken();
    }

    /**
     * Returns the token stored in the storage (see .prepare() to change the type of the storage),
     * or takes the provided one and checks if the token is valid.
     * This function does the remote call.
     * @returns {Promise<*>}
     */
    async getToken(token, validityCheck = true) {
        if (_.isStringNotEmpty(token)) {
            return token;
        }

        token = await this.getNetwork().passport.getJWT();
        if (_.isStringNotEmpty(token)) {

            if (validityCheck !== false) {
                if (this.getNetwork().passport.payloadIsValid(token)) {
                    return token;
                }
            } else {
                return token;
            }
        }

        return null;
    }

    /**
     * Retrives user structure for the specified or stored token.
     * This function does the remote call.
     * Dont use the function in rendering the UI or stuff like that.
     * The right choice would be to use the cached user inside the component by making a HOC connected
     * to the redux store via Component.connectStore() method. See examples in the code.
     * @param token
     * @returns {Promise<*>}
     */
    async getUser(token = null) {
        const id = await this.getUserId(token);
        if (!id) {
            return null;
        }

        return User.get(id);
    }
}
