import BaseModel from '../../../sub-form/model-sub-item.js';

export default class Model extends BaseModel {
    static extractItems(data) {
        return data.extractExpertise();
    }

    static putItems(data, items) {
        return data.putExpertise(items);
    }

    static makeSubModel(data) {
        let model = {};
        if (data) {
            model = _.deepClone(this.extractItems(data));
        }

        if (!_.isArrayNotEmpty(model.specialities)) {
            model.specialities = [];
        }

        model.type = [];
        _.each(model.specialities, (item) => {
            model.type.push(item.key);
        });

        // set some artificial fields
        this.updateSubModel(model);

        return model;
    }

    static applySubModelToSource(model, target) {

        if (!_.isObject(target)) {
            return;
        }

        this.putItems(target, model);
    }
}
