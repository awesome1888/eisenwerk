import BaseModel from '../../../sub-form/model-sub-item.js';

export default class Model extends BaseModel {
    static extractItems(data) {
        return data.extractEducation();
    }

    static putItems(data, items) {
        return data.putEducation(items);
    }
}
