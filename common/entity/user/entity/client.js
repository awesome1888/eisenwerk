import Entity from '../../../lib/entity/client.js';
import Common from './both.js';

export default class UserEntity extends mix(Entity).with(Common) {
    static getServiceName() {
        return 'users';
    }

    async populate() {
        return Promise.all([
        ]);
    }
}
