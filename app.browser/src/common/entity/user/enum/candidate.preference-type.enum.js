import EnumFactory from './../../../lib/util/enum-factory/index.js';

class CareerPreferenceTypeEnumFactory extends EnumFactory {


    constructor(items) {
        super(items || [
            {value: 'Permanent job opportunities', valueDE: 'Permanent job opportunities', key: 'PO'},
            {value: 'Freelance job opportunities', valueDE: 'Freelance job opportunities', key: 'FO'},
        ]);

        this.FREELANCE = 'FO';
        this.PERMANENT = 'PO';
    }
}

export default new CareerPreferenceTypeEnumFactory();
