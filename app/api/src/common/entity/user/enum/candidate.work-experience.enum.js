import EnumFactory from './../../../lib/util/enum-factory/index.js';

class CareerPreferenceNoticePeriodEnumFactory extends EnumFactory {

    constructor(items) {
        super(items || [
            {value: '0 - 1 years', key: '0-1', sort: 0},
            {value: '1 - 2 years', key: '1-2', sort: 1},
            {value: '2 - 4 years', key: '2-4', sort: 2},
            {value: '4 - 6 years', key: '4-6', sort: 3},
            {value: '6 - 10 years', key: '6-10', sort: 4},
            {value: '10 - 15 years', key: '10-15', sort: 5},
            {value: 'More than 15 years', key: '>15', sort: 6},
        ]);
    }
}

export default new CareerPreferenceNoticePeriodEnumFactory();
