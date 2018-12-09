import BaseService from '../../../lib/vendor/feathersjs/service/index';
import Entity from '../entity/server';
import roleEnum from '../enum/role';
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
        AuthorizationHook.declarePreProcess(hooks);
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
                const legalGoogleEmail = AuthorizationHook.isLegalGoogleEmail(
                    email,
                );

                // you are not allowed to create administrators, unless you came from google
                if (_.contains(data.role, roleEnum.ADMINISTRATOR)) {
                    if (!isGoogle || !legalGoogleEmail) {
                        Error.throw403(
                            'You are not allowed to create administrators',
                        );
                    }
                }

                // you are not allowed to register with random emails through google
                // if (isGoogle && !legalGoogleEmail) {
                //     this.throw403('You are not allowed to register with that kind of email');
                // }

                return context;
            },
        };
    }
}
