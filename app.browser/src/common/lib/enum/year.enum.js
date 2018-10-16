import EnumFactory from '../util/enum-factory/index.js';

class YearEnumFactory extends EnumFactory {
    constructor(items) {
        super();

        if (!items) {
            items = this.makeRange();
        }
        this.setItems(items);
    }

    getWeight(key) {
        const item = this.getByKey(key);
        if (!item) {
            return 0;
        }

        return item.weight || 0;
    }

    makeFromRange(from, to) {
        return this.make(this.makeRange(from, to));
    }

    getCurrentYear() {
        return (new Date()).getUTCFullYear();
    }

    makeRange(from = 2000, to = 2024) {
        const items = [];
        const asc = from < to;
        for (let i = from; asc ? i <= to : i >= to; i += asc ? 1 : -1) {
            items.push({key: i.toString(), value: i.toString(), weight: i});
        }

        return items;
    }

    selectizeInverse() {
        return _.sortBy(this.selectize(), 'key').reverse();
    }
}

export default new YearEnumFactory();
