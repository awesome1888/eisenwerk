import BaseModel from '../../../sub-form/model-sub-item.js';

export default class Model extends BaseModel {
    static extractItems(data) {
        return data.extractDocuments();
    }

    static putItems(data, items) {
        return data.putDocuments(items);
    }
}
