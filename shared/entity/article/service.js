import BaseService from '../../lib/vendor/feathersjs/service';
import Entity from './entity/server.js';

export default class ArticleService extends BaseService {
    /**
     * Returns an entity this service provides an access to
     * @returns {Entity}
     */
    static getEntity() {
        return Entity;
    }

    static getDescription() {
        return 'articles (just for <script>alert("test")</script>)';
    }

    isTimeStampEnabled() {
        return true;
    }

    /**
     * Returns access rights for exposing this entity over the wire. They don't get applied when working server-side.
     * @returns {{}}
     */
    getCRUDAccessRules() {
        const allow = {
            deny: false,
            authorized: false,
        };

        return {
            get: allow,
            find: allow,
            create: allow, // todo: also alias as post
            patch: allow, // todo: also alias as update
            update: allow, // todo: also alias as put and replace
        };
    }
}
