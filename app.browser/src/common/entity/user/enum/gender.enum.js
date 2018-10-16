import EnumFactory from './../../../lib/util/enum-factory/index.js';

class GenderEnumFactory extends EnumFactory {

    // FEMALE = 'female';
    // MALE = 'male';

    constructor(items) {
        super(items || [
            {value: 'Ms', valueDE: 'Frau', key: 'female'},
            {value: 'Mr', valueDE: 'Herr', key: 'male'},
            {value: 'Salutation', valueDE: 'Andere', key: 'unknown'},
        ]);
    }

    selectizeSimple() {
        const items = this.selectize();
        return items.filter(it => it.key !== 'unknown');
    }

    hasValue(gender) {
        return gender === 'male' || gender === 'female';
    }
}

export default new GenderEnumFactory();
