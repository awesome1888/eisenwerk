import mongoose from 'mongoose';
import BaseEntity from './both.js';

const models = {};

export default class Entity extends BaseEntity {

    static getSchema() {
        return {};
    }

    static getModel() {
        const id = this.getUId();

        if (!models[id]) {
            models[id] = mongoose.model(this.getUId(), this.prepareSchema());
        }

        return models[id];
    }

    static prepareSchema() {
        let schema = this.getSchema();
        if (!(schema instanceof Schema)) {
            schema = new Schema(schema);
        }

        return schema;
    }

    getModel() {
        return this.constructor.getModel();
    }

    getUId() {
        return this.constructor.getUId();
    }
}
