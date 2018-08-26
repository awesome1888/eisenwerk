import EnumFactory from './../../../lib/util/enum-factory/index.js';

class CareerPreferenceCompanyEnumFactory extends EnumFactory {

    constructor(items) {
        super(items || [
            {value: 'Startups', key: 'SU'},
            {value: 'Mid-sized companies', key: 'MS'},
            {value: 'Major corporations', key: 'MA'},
        ]);
    }
}

export default new CareerPreferenceCompanyEnumFactory();
