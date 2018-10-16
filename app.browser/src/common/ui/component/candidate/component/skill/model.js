import BaseModel from '../../../sub-form/model-sub-item.js';

export default class Model extends BaseModel {
    static extractItems(data) {
        return data.extractSkills();
    }

    static putItems(data, items) {
        return data.putSkills(items);
    }

    static makeSubModel(data) {
        let model = {
            skills: []
        };

        if (!_.isEmpty(data)) {
            model = {skills: _.deepClone(this.extractItems(data))};
        }
        if (!_.isArrayNotEmpty(model.skills)) {
            model.skills.push({});
        }

        // set some artificial fields
        this.updateSubModel(model);

        return model;
    }

    static applySubModelToSource(model, target) {
        if (!_.isObject(target)) {
            return;
        }

        const items = model.skills || [];

        if (!_.isEmpty(target)) {
            this.putItems(target, items);
        }
    }
}
