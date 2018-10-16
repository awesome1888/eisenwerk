import EnumFactory from '../util/enum-factory/index.js';

class MonthEnumFactory extends EnumFactory {
    constructor(items) {
        super(items || [
            {key: 'JAN', valueDE: 'Januar', value: 'January', weight: 1},
            {key: 'FEB', valueDE: 'Februar', value: 'February', weight: 2},
            {key: 'MAR', valueDE: 'März', value: 'March', weight: 3},
            {key: 'APR', valueDE: 'April', value: 'April', weight: 4},
            {key: 'MAI', valueDE: 'Mai', value: 'May', weight: 5},
            {key: 'JUN', valueDE: 'Juni', value: 'June', weight: 6},
            {key: 'JUL', valueDE: 'Juli', value: 'July', weight: 7},
            {key: 'AUG', valueDE: 'August', value: 'August', weight: 8},
            {key: 'SEP', valueDE: 'September', value: 'September', weight: 9},
            {key: 'OCT', valueDE: 'Oktober', value: 'October', weight: 10},
            {key: 'NOV', valueDE: 'November', value: 'November', weight: 11},
            {key: 'DEC', valueDE: 'Dezember', value: 'December', weight: 12}
        ]);
    }

    getWeight(key) {
        const item = this.getByKey(key);
        if (!item) {
            return 0;
        }

        return item.weight || 0;
    }

    getKeyByIndex(index, oneBased = true) {
        index = parseInt(index, 10);
        if (!Number.isNaN(index)) {// eslint-disable-line
            if (oneBased) {
                index -= 1;
            }

            const item = this.items[index];
            if (item) {
                return item.key;
            }
        }

        return null;
    }
}

export default new MonthEnumFactory();
