import EnumFactory from '../../../lib/util/enum-factory/index.js';

class SkillLevelEnumFactory extends EnumFactory {

    constructor(items) {
        super(items || [
            {value: 'Beginner', key: 'L1'},
            {value: 'Elementary', key: 'L2'},
            {value: 'Intermediate', key: 'L3'},
            {value: 'Upper intermediate', key: 'L4'},
            {value: 'Advanced', key: 'L5'},
            {value: 'Proficiency', key: 'L6'},
        ]);
    }
}

export default new SkillLevelEnumFactory();
