import BaseEntity from './both.js';
import Method from '../util/method/client.js';

export default class Entity extends BaseEntity {
    /**
     * Execute method, client-side
     * @param name
     * @param args
     * @returns {Promise<void>}
     */
    static async execute(name, args = {}) {
        return Method.execute(`${this.getUId()}.name`, args);
    }
}
