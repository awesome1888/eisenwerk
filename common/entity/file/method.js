import Method from '../../lib/util/method/server.js';
import Entity from './entity/server.js';

export default class FileMethod extends Method {

    static getDeclaration() {
        const prefix = Entity.getUId();
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
