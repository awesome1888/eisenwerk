import BaseService from '../../../lib/vendor/feathersjs/service/index.js';
import Entity from '../entity/server.js';
import access from '../access';

export default class FileService extends BaseService {
    /**
     * Returns an entity this service provides an access to
     * @returns {Entity}
     */
    static getEntity() {
        return Entity;
    }

    static getDescription() {
        return 'uploaded files';
    }

    getCRUDAccessRules() {
        return access;
    }

    isTimeStampEnabled() {
        return true;
    }
}
