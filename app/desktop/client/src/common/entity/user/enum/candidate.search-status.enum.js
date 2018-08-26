import EnumFactory from './../../../lib/util/enum-factory/index.js';

class CareerPreferenceSearchStatusEnumFactory extends EnumFactory {

    constructor(items) {
        super(items || [
            {value: 'Not open to considering new opportunities', key: 'NO'},
            {value: 'Open to exploring new opportunities', key: 'OP'},
            {value: 'Ready to interview and actively searching', key: 'RI'},
            {value: 'In early stages of interviews', key: 'IN'},
            {value: 'In final stages of interviews', key: 'FI'},
            {value: 'At offer stage with one or more companies', key: 'CO'},
        ]);
    }
}

export default new CareerPreferenceSearchStatusEnumFactory();
