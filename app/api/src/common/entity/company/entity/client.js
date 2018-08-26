import Entity from '../../../lib/entity/client.js';
import Common from './both.js';

export default class CompanyEntity extends mix(Entity).with(Common) {

    getDetails() {
        return this.getData().details || {};
    }

    putDetails(items) {
        this.getData().details = _.deepClone(items);
    }

}
