import EnumFactory from './../../../lib/util/enum-factory/index.js';

class CareerPreferencePreferredRoleEnumFactory extends EnumFactory {

    constructor(items) {
        super(items || [
            {value: 'Business Intelligence', key: 'BI'},
            {value: 'Data Analysis', key: 'DA'},
            {value: 'Data Engineering', key: 'DE'},
            {value: 'Machine Learning', key: 'ML'},
            {value: 'Data Science', key: 'DS'},
        ]);
    }
}

export default new CareerPreferencePreferredRoleEnumFactory();
