import EnumFactory from '../util/enum-factory/index.js';

class LanguageLevelEnumFactory extends EnumFactory {

    constructor(items) {
        super(items || [
            {value: 'Proficiency', valueDE: 'Exzellente Kenntnisse (C2)', key: 'C2', weight: 6},
            {value: 'Advanced', valueDE: 'Fortgeschrittene Kenntnisse (C1)', key: 'C1', weight: 5},
            {value: 'Upper intermediate', valueDE: 'Gute Mittelstufe (B2)', key: 'B2', weight: 4},
            {value: 'Intermediate', valueDE: 'Mittelstufe (B1)', key: 'B1', weight: 3},
            {value: 'Elementary', valueDE: 'Grundlagen (A2)', key: 'A2', weight: 2},
            {value: 'Beginner', valueDE: 'Einstieg (A1)', key: 'A1', weight: 1},
        ]);
    }

    // isGreaterOrEqual(a, b) {
    //     const itemA = this.getByKey(a);
    //     const itemB = this.getByKey(b);
    //
    //     if (!itemA || !itemB) {
    //         return false;
    //     }
    //
    //     return itemA.weight <= itemB.weight;
    // }
}

export default new LanguageLevelEnumFactory();
