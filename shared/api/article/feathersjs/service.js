import BaseService from '../../../lib/vendor/feathersjs/service/index';
import Entity from '../entity/server';
import Access from '../access';

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

    getCRUDAccessRules() {
        return Access;
    }

    isTimeStampEnabled() {
        return true;
    }
}
