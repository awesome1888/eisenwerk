import BaseService from '../../lib/entity/service/index.js';
import Entity from './entity/server.js';
import roleEnum from './enum/role.js';
import AuthorizationHook from './hooks/authorization.js';
import Context from '../../lib/entity/service/context';
import Error from '../../lib/util/error';

export default class UserService extends BaseService {

    /**
     * Returns an entity this service provides an access to
     * @returns {Entity}
     */
    static getEntity() {
        return Entity;
    }

    static getDesciption() {
        return 'users persisted in the system';
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
     * Returns access rights for exposing this entity over the wire. They don't get applied when working server-side.
     * @returns {{}}
     */
    getCRUDAccessRules() {
        return {
            get: this.getRuleRead(),
            find: this.getRuleRead(),
            patch: this.getRuleUpdate(),

            // everybody can create a new user, but see the limitations in .checkIntegrityOnCreate()
            create: {
                deny: false,
                authorized: false,
            },

            // we forbid PUT for this entity, it is inappropriate.
            update: {
                deny: true,
            },

            // only admins can do other operations
            default: {
                deny: false,
                authorized: true,
                roleAll: [roleEnum.ADMINISTRATOR],
            },
        };
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
                const email = _.get(data, 'profile.email') || data['profile.email'];
                const isGoogle = _.isObjectNotEmpty(params.oauth) && params.oauth.provider === 'google';
                const legalGoogleEmail = AuthorizationHook.isLegalGoogleEmail(email);

                // you are not allowed to create administrators, unless you came from google
                if (_.contains(data.role, roleEnum.ADMINISTRATOR)) {
                    if (!isGoogle || !legalGoogleEmail) {
                        Error.throw403('You are not allowed to create administrators');
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

    /**
     * Any authorized user being in any of three legal roles can read data from the entity,
     * but with additional limitations for certain roles.
     * @returns {{deny: boolean, authorized: boolean, roleAny: *[], custom: (function(*, *, *=): boolean)}}
     */
    getRuleRead() {
        return {
            deny: false,
            authorized: true,
            roleAny: [roleEnum.ADMINISTRATOR],
            // custom: (user, context) => {
            //     if (user.hasRole(roleEnum.SOME_ROLE)) {
            //         this.attachMandatoryCondition(context, {
            //             $or: [
            //                 {_id: user.getId()},
            //                 {role: roleEnum.SOME_ROLE},
            //             ],
            //         });
            //     }
            //
            //     return true;
            // },
        };
    }

    getRuleUpdate() {
        return {
            deny: false,
            authorized: true,
            roleAny: [roleEnum.ADMINISTRATOR],
            custom: async (user, context) => {
                const id = context.id;
                const data = context.data;

                if (id) {
                    // for patching an existing entity: nobody except an administrator can change other
                    // user accounts but their own
                    if (!user.hasRole(roleEnum.ADMINISTRATOR)) {
                        if (id.toString() !== user.getId().toString()) {
                            Error.throw403('You are not allowed to update other users');
                        }
                    }
                }

                if (_.isArrayNotEmpty(data.role)) {
                    const previous = await Context.getPrevious(context, this.getEntity());

                    const oRole = previous.getRole();
                    const nRole = data.role;
                    if (!_.isEqual(nRole, oRole)) {
                        // you are not allowed to change roles in general,
                        Error.throw403('You are not allowed to change roles');
                    }
                }
            },
        };
    }
}
