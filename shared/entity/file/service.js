import BaseService from '../../lib/vendor/feathersjs/service/index.js';
import Entity from './entity/server.js';

export default class FileService extends BaseService {
    /**
     * Returns an entity this service provides an access to
     * @returns {Entity}
     */
    static getEntity() {
        return Entity;
    }

    static getDesciption() {
        return 'uploaded files';
    }

    isTimeStampEnabled() {
        return true;
    }

    /**
     * Returns access rights for exposing this entity over the wire. They don't get applied when working server-side.
     * @returns {{}}
     */
    getCRUDAccessRules() {
        const access = {
            deny: false,
            authorized: true,
        };

        return {
            get: access,
            find: access,
            create: access,
            default: {
                deny: true,
            },
        };
    }
}
