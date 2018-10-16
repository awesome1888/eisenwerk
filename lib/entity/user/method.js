import Method from '../../lib/util/method/server.js';
import Entity from './entity/server.js';

export default class UserMethod extends Method {

    static getDeclaration() {
        const prefix = Entity.getUId();
        return {
        };
    }
}
