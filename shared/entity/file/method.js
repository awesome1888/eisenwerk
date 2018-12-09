import Method from '../../lib/vendor/feathersjs/method/server.js';
import Entity from './entity/server.js';

export default class FileMethod extends Method {
    static getDeclaration() {
        const prefix = Entity.getUId();
        // todo: refactor this to '.token.get': {blah}
        return {
            [`${prefix}.token.get`]: {
                body: 'tokenGet',
            },
        };
    }

    tokenGet() {
        return '';
    }
}
