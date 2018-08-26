import BaseService from '../../lib/entity/service/index.js';
import Entity from './entity/server.js';
import roleEnum from '../../lib/enum/role.js';
import CompletionHook from './hooks/completion.js';
import UserLinkHook from './hooks/user-link.js';

export default class CompanyService extends BaseService {

    /**
     * Returns an entity this service provides an access to
     * @returns {Entity}
     */
    static getEntity() {
        return Entity;
    }

    declareIntegrityHooks(hooks) {
        CompletionHook.declare(hooks);
        UserLinkHook.declare(hooks);
        super.declareIntegrityHooks(hooks);
    }

    /**
     * Returns access rights for exposing this entity over the wire. They don't get applied when working server-side.
     * @returns {{}}
     */
    getCRUDAccessRules() {
        return {
            get: this.getRuleRead(),
            find: this.getRuleRead(),
            default: this.getRuleChange(),
        };
    }

    /**
     * Any authorized user being in any of three legal roles can read data from the entity,
     * but for employers there is an additional limitation: they can see only their own company.
     * @returns {{deny: boolean, authorized: boolean, roleAny: *[], custom: (function(*, *, *=): boolean)}}
     */
    getRuleRead() {
        return {
            deny: false,
            authorized: true,
            roleAny: [roleEnum.ADMINISTRATOR, roleEnum.CANDIDATE, roleEnum.EMPLOYER],
            custom: (user, context) => {
                // prevent employers from seeing other companies
                if (user.hasRole(roleEnum.EMPLOYER)) {
                    this.attachMandatoryCondition(context, {
                        employers: user.getId(),
                    });
                }

                return true;
            },
        };
    }

    /**
     * Only admins can edit/remove the entity
     * @returns {{deny: boolean, authorized: boolean, roleAll: *[]}}
     */
    getRuleChange() {
        return {
            deny: false,
            authorized: true,
            roleAll: [roleEnum.ADMINISTRATOR],
        };
    }
}
