import BaseService from '../../../lib/vendor/feathersjs/service/index';
import Entity from '../entity/server';
import AuthorizationHook from './authorizationHook';
import Error from '../../../lib/vendor/feathersjs/error';
import access from '../access';

export default class UserService extends BaseService {
    /**
     * Returns an entity this service provides an access to
     * @returns {Entity}
     */
    static getEntity() {
        return Entity;
    }

    static getDescription() {
        return 'users persisted in the system';
    }

    getCRUDAccessRules() {
        return access;
    }

    isTimeStampEnabled() {
        return true;
    }

    attachPrecedingHooks(hooks) {
        AuthorizationHook.declarePreProcess(hooks, this.getApplication());
        super.attachPrecedingHooks(hooks);
    }

    attachSecurityHooks(hooks) {
        AuthorizationHook.declare(hooks, this.getApplication());
        super.attachSecurityHooks(hooks);
    }

    /**
     * Returns integrity checkers (functions) for each operation: create, update, patch, delete. These functions get
     * executed every time, regardless over the wire you make your call or not. So by implementing the function you
     * may control the integrity of your data: prevent some fields from changing by certain users, etc.
     * @returns {{}}
     */
    getIntegrityCheckers() {
        return {
            create: async (data, context) => {
                const params = context.params;
                const email =
                    _.get(data, 'profile.email') || data['profile.email'];
                const isGoogle =
                    _.isObjectNotEmpty(params.oauth) &&
                    params.oauth.provider === 'google';
                const legalGoogleEmail = AuthorizationHook.isLegalEmail(
                    email,
                    this.getApplication().getOAuthGoogleDomain(),
                );

                if (isGoogle && !legalGoogleEmail) {
                    Error.throw403('You are not allowed join with this domain');
                }

                return context;
            },
        };
    }
}
