import _ from './global/lodash';

export default class Enum {
    constructor(declaration) {
        this._items = [];
        this._k2v = null;
        this._v2k = null;
        this._k2o = null;

        if (!_.isArray(declaration)) {
            throw new TypeError('Illegal enum declaration');
        }

        declaration.filter((item) => {
            item.key = item.key.toString().trim().toUpperCase();
            return _.isStringNotEmpty(item.key);
        });

        this._items = declaration;
        declaration.forEach((item) => {
            this[`KEY_${item.key}`] = item.key;
        });
    }

    getKey(value) {
        if (!this._k2v) {
            this._k2v = this.makeMap('value', 'key');
        }

        return this._k2v[value];
    }

    getValue(key) {
        if (!this._v2k) {
            // todo: this will not work well with value duplicates
            this._v2k = this.makeMap('key', 'value');
        }

        return this._v2k[key] || null;
    }

    getKeys() {
        return this.get('key');
    }

    getValues() {
        return this.get('value');
    }

    getValuesByKeys(keys) {
        if (_.isArrayNotEmpty(keys)) {
            return keys.map((key) => {
                return this.getValue(key);
            });
        }

        return [];
    }

    get(key) {
        return this._items.reduce((result, item) => {
            if (key in item) {
                result.push(item[key]);
            }
            return result;
        }, []);
    }

    getItemByKey(key) {
        if (!this._k2o) {
            this._k2o = this._items.reduce((result, item) => {
                result[item.key] = item;
                return result;
            }, {});
        }

        return this._k2o[key] || null;
    }

    isLegalKey(key) {
        return _.isObjectNotEmpty(this.getItemByKey(key));
    }

    makeMap(keyAs = null, valueAs = null) {
        keyAs = keyAs || 'key';
        valueAs = valueAs || 'value';

        return this._items.reduce((result, item) => {
            result[item[keyAs]] = item[valueAs];
            return result;
        }, {});
    }

    map(cb) {
        if (_.isFunction(cb)) {
            return this._items.map(cb);
        }

        return [];
    }

    forEach(cb) {
        if (_.isFunction(cb)) {
            this._items.forEach(cb);
        }
    }

    find(cb) {
        if (_.isFunction(cb)) {
            return this._items.find(cb);
        }

        return false;
    }

    add(item) {
        this._items.push(item);
        this.clearCaches();
    }

    invalidateCache() {
        this._k2v = null;
        this._v2k = null;
        this._k2o = null;
    }

    sort(attribute, comparator) {
        this._items.sort((a, b) => {
            return comparator(a[attribute], b[attribute]);
        });
    }
}
