import BaseModel from '../../../sub-form/model-sub-item.js';

export default class Model extends BaseModel {
    static extractItems(data) {
        return data.getLanguagesDisplaySorted();
    }

    static putItems(data, items) {
        return data.putLanguages(items);
    }

    static makeSubModel(data) {
        let model = {
            language: []
        };
        if (data) {
            model = {language: _.deepClone(this.extractItems(data))};
        }
        if (!_.isArrayNotEmpty(model.language)) {
            model.language.push({});
        }

        // set some artificial fields
        this.updateSubModel(model);

        return model;
    }

    static applySubModelToSource(model, target) {
        if (!_.isObject(target)) {
            return;
        }

        const items = model.language || [];

        if (!_.isEmpty(target)) {
            this.putItems(target, items);
        }
    }
}
