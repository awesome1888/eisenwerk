import EnumFactory from '../../../lib/util/enum-factory/index.js';

class SizeEnumFactory extends EnumFactory {
    constructor() {
        super([
            {key: '1-50', value: '1-50 Mitarbeiter', valueEn: '1-50'},
            {key: '51-500', value: '51-500 Mitarbeiter', valueEn: '51-500'},
            {key: '501-5000', value: '501-5.000 Mitarbeiter', valueEn: '501-5,000'},
            {key: '5001', value: '5.001+ Mitarbeiter', valueEn: '5,001+'},
        ]);
    }
}

export default new SizeEnumFactory();
