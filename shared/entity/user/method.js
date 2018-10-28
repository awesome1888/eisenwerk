import Method from '../../lib/method/server.js';
import Entity from './entity/server.js';

export default class UserMethod extends Method {
    static getDeclaration() {
        const prefix = Entity.getUId();
        return {
        };
    }
}
