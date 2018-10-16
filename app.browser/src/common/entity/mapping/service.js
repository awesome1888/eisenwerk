import BaseService from '../../lib/entity/service/index.js';
import Entity from './entity/server.js';
import roleEnum from '../../lib/enum/role.js';

export default class ArticleService extends BaseService {

    /**
     * Returns an entity this service provides an access to
     * @returns {Entity}
     */
    static getEntity() {
        return Entity;
    }

    /**
     * Returns access rights for exposing this entity over the wire. They don't get applied when working server-side.
     * C-UD operations are not allowed.
     * @returns {{}}
     */
    getCRUDAccessRules() {
        return {
            get: this.getRuleRead(),
            find: this.getRuleRead(),
        };
    }

    /**
     * Any authorized user being in any of three legal roles can read data from the entity.
     * @returns {{deny: boolean, authorized: boolean, roleAny: *[], custom: (function(*, *, *=): boolean)}}
     */
    getRuleRead() {
        return {
            deny: false,
            authorized: true,
            roleAny: [roleEnum.ADMINISTRATOR, roleEnum.CANDIDATE, roleEnum.EMPLOYER, roleEnum.PRE_CANDIDATE],
        };
    }
}
