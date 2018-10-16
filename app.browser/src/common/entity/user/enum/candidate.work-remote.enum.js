import EnumFactory from './../../../lib/util/enum-factory/index.js';

class CareerPreferenceWorkRemoteEnumFactory extends EnumFactory {

    constructor(items) {
        super(items || [
            {value: 'Yes', key: 'YES', display: 'Interested in working remotely'},
            {value: 'No', key: 'NO', display: 'Not interested in working remotely'},
            {value: 'Remote only', key: 'RO', display: 'Only interested in working remotely'},
        ]);
    }
}

export default new CareerPreferenceWorkRemoteEnumFactory();
