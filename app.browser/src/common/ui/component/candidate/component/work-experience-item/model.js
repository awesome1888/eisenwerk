import BaseModel from '../../../sub-form/model-sub-item.js';

import monthRangeEnum from '../../../../../lib/enum/month-range.enum.js';

export default class Model extends BaseModel {

    static makeSubModel(data, props) {
        const model = super.makeSubModel(data, props);

        // convert dates to structure
        model.start = monthRangeEnum.convertToStructureUTC(model.start, true);
        model.end = monthRangeEnum.convertToStructureUTC(model.end, true);

        return model;
    }

    static makeSourceItem(item) {
        item = _.deepClone(item);

        // convert structure to dates
        item.start = monthRangeEnum.convertFromStructureUTC(item.start, true);
        item.end = monthRangeEnum.convertFromStructureUTC(item.end, true);

        return item;
    }

    static extractItems(data) {
        return data.extractWorkExperience();
    }

    static putItems(data, items) {
        return data.putWorkExperience(items);
    }

    static filterArray(arr) {
        if (!_.isArrayNotEmpty(arr)) {
            return [];
        }

        return arr.filter(x => !!x);
    }
}
