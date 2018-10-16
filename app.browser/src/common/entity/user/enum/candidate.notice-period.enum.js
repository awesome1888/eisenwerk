import EnumFactory from './../../../lib/util/enum-factory/index.js';

class CareerPreferenceNoticePeriodEnumFactory extends EnumFactory {

    constructor(items) {
        super(items || [
            {value: 'Less than 1 month', key: 'L1', display: 'Less than 1 month notice period'},
            {value: '1 month', key: '1M', display: '1 month notice period'},
            {value: '2 month', key: '2M', display: '2 month notice period'},
            {value: '3 month', key: '3M', display: '3 month notice period'},
            {value: '4 month', key: '4M', display: '4 month notice period'},
            {value: '5 month', key: '5M', display: '5 month notice period'},
            {value: '6 month', key: '6M', display: '6 month notice period'},
            {value: 'More than 6 months', key: 'M6', display: 'More than 6 months notice period'},
        ]);
    }
}

export default new CareerPreferenceNoticePeriodEnumFactory();
