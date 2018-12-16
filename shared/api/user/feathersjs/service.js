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

    attachSecurityHooks(hooks) {
        AuthorizationHook.declare(hooks, this.getApplication());
        super.attachSecurityHooks(hooks);
    }
}
