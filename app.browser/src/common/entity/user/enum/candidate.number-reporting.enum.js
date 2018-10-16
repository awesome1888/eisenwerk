import EnumFactory from './../../../lib/util/enum-factory/index.js';

class CareerPreferenceNumberReportingEnumFactory extends EnumFactory {

    constructor(items) {
        super(items || [
            {value: 'None', key: '0-1'},
            {value: '1 - 5', key: '1-2'},
            {value: '6 - 10', key: '2-4'},
            {value: '11 - 20', key: '4-6'},
            {value: '21 - 40', key: '6-10'},
            {value: 'More than 40', key: '10-15'},
        ]);
    }
}

export default new CareerPreferenceNumberReportingEnumFactory();
