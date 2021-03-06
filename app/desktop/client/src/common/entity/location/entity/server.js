import schema from '../schema.js';
import BaseEntity from '../../../lib/entity/server.js';
import Common from './both.js';

export default class LocationEntity extends mix(BaseEntity).with(Common) {
    static getSchema() {
        return schema;
    }
}
