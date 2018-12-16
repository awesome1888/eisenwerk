import auth from '@feathersjs/authentication-client';
import AuthorizationBoth from './both';

export default class Authorization extends AuthorizationBoth {
    /**
     * Tune feathersjs client app with appropriate configuration.
     * @param application
     * @param storage
     * @param userEntity
     */
    static prepare(application, storage, userEntity) {
        application.configure(
            auth({
                // todo: use custom storage in order to obtain the token either from localStorage or the URL
                storage,
                storageKey: 'jwt',
            }),
        );
    }

    /**
     * Authenticate a user with a given strategy
     * @param how
     * @param data
     * @returns {Promise<*>}
     */
    async signIn(how = 'local', data = {}) {
        if (!window) {
            return null;
        }

        if (how === 'local') {
            return super.signIn(how, data);
        }

        // todo: check for legal "how"

        // we don't want this when doing ssr
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

        this.getNetwork().passport.setJWT(token);
        window.__authAgentPrevReject = null;

        const userId = await this.getUserId(token);
        this.getNetwork().emit('authenticated');

        return userId;
    }

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
        if (!_.isStringNotEmpty(token)) {
            return false;
        }

        return this.getNetwork().passport.payloadIsValid(token);
    }
}
