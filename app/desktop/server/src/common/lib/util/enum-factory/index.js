// import LanguageController from '../language/index.js';

export default class EnumFactory {

    constructor(items = []) {
        this._cache = null;
        this.setItems(items);
    }

    /**
     * Returns the name of the field `value`, based on the language of the user
     */
    _getValueFieldName() {
        // todo: this is not good for an isomorphic code :(
        // if (LanguageController.getLanguage() === 'de') {
        //     return 'valueDE';
        // }
        return 'value';
    }

    setItems(items = []) {
        this.items = items || [];
        this.invalidateCache();
    }
    /**
     * (generic) returns an array with the param name passed
     * @param {string} paramName the name of the param of the enum
     * @returns {list} The list of the paramName values
     */
    get(paramName) {
        return this.items && _.pluck(this.items, paramName);
    }
    /**
     * return the values of the object (param value)
     * @returns {list} The list of the values
     * @deprecated
     */
    get values() {
        return this.get(this._getValueFieldName());
    }

    /**
     * return the values of the object (param value)
     * @returns {list} The list of the values
     */
    getValues() {
        return this.get(this._getValueFieldName());
    }

    /**
     * return an object with teh keys set to key and value of object {KEY: 'KEY', kEY2: 'KEY2'}
     */
    get enums() {
        return this.getObject('key', 'key');
    }
    /**
     * returns the keys of the object (param key)
     * @returns {list} The list of the keys
     */
    get keys() {
        return this.get('key');
    }
    get last() {
        if (!_.isArrayNotEmpty(this.items)) {
            return null;
        }
        return this.items[this.items.length - 1];
    }

    getFirst() {
        return this.items[0] || null;
    }

    /**
     * (generic) This function creates an object with the key being the values of the keyParamName
     * and the values with the values from valueParamName
     * @param {string} keyParamName the name of the param that will be the key
     * @param {string} valueParamName the name of the params that will be the value
     * @returns {list} The list of objects with keyParamName and valueParamName
     */
    getObject(keyParamName, valueParamName) {
        const obj = {};
        if (this.items) {
            this.items.forEach((item) => {
                obj[item[keyParamName]] = item[valueParamName];
            });
        }
        return obj;
    }
    /**
     * return the items in object format: {key: value, key2: value2, ...}
     * @returns {list} The list of objects with key and value
     */
    get object() {
        return this.getObject('key', this._getValueFieldName());
    }
    /**
     * returns a list converted from fromAttName to toAttName
     * @param {list} elements the elements to be converted
     * @param {string} fromAttName the name of the attribute to search for
     * @param {string} toAttName the name of the attribute to return
     * @returns {list} The list with fromAttaName attributes
     */
    fromToArray(elements, fromAttName, toAttName) {
        if (!_.isArray(elements)) {
            return [];
        }
        let match = null;
        return elements.map((el) => {
            // todo: better to use object as index instead of find()
            match = this.items.find(item => item[fromAttName] === el);
            if (match) {
                return match[toAttName];
            }

            return null;
        });
    }
    /**
     * returns the raw enum
     * usage: filters
     * @returns {list} the raw enum
     */
    getRawEnum() {
        return this.items;
    }
    forEach(cb) {
        this.items.forEach(cb);
    }
    map(cb) {
        return this.items.map(cb);
    }
    reduce(cb, initial = []) {
        return this.items.reduce(cb, initial);
    }
    filter(fn, getArray = false) {
        const items = this.items.filter(fn);
        if (getArray) {
            return items;
        } else {
            return new this.constructor(_.deepClone(items));
        }
    }
    find(cb) {
        return this.items.find(cb);
    }
    /**
     * convert the values passed to their respective keys
     * @param {string} values
     * @returns {list} The list with key attributes
     */
    keysFromValues(values) {
        return this.fromToArray(values, this._getValueFieldName(), 'key');
    }
    /**
     * convert the keys passed to their respective values
     * @param {string} values
     * @returns {list} The list with value attributes
     */
    valuesFromKeys(keys) {
        return this.fromToArray(keys, 'key', this._getValueFieldName());
    }
    /**
     * returns a list of items (objects) converted from fromAttName to toAttName
     * @param {list} elements list of elements
     * @param {string} fromAttName the name of the attribute of the elements
     * @returns {list} The list of items
     */
    fromToItems(elements, fromAttName) {
        return elements && elements.map(el =>
            this.items.filter(item => item[fromAttName] === el)[0]);
    }
    /**
     * returns a list of items (objects) converted from values to keys
     * @param {list} values list of values
     * @returns {list} The list of items
     */
    itemsFromValues(values) {
        return this.fromToItems(values, this._getValueFieldName());
    }
    /**
     * returns a list of items (objects) converted from keys to values
     * @param {list} keys list of keys
     * @returns {list} The list of items
     */
    itemsFromKeys(keys) {
        return this.fromToItems(keys, 'key');
    }
    /**
     * returns a list of items (objects) converted to use for selects
     * @returns {list} The list of items following the format
     * {value: item.key, key: item.key, label: item.value}
     */
    selectize() {
        return this.selectizeItems(this.items);
    }

    selectizeSorted() {
        const lgs = this.selectizeItems(this.items);
        return _.sortBy(lgs, 'label');
    }

    selectizeExtended() {
        return this.selectize();
    }

    /**
     * @access protected
     * @param items
     * @returns {Array}
     */
    selectizeItems(items) {
        const array = [];
        items.forEach((item) => {
            const obj = {
                value: item.key,
                key: item.key,
                label: item[this._getValueFieldName()]
            };
            array.push(obj);
        });
        return array;
    }
    /**
     * returns the first key that matches a given value
     * @param {string} value
     * @returns {string}
     */
    getKeyByValue(value) {
        if (!value) {
            return null;
        }

        const res = this.keysFromValues([value]);
        if (_.isArrayNotEmpty(res)) {
            return res[0];
        }

        return null;
    }
    getKeyByIndex(index) {
        index = parseInt(index, 10);
        if (!Number.isNaN(index)) {// eslint-disable-line
            const item = this.items[index];
            if (item) {
                return item.key;
            }
        }

        return null;
    }
    getValueByIndex(index) {
        index = parseInt(index, 10);
        if (!Number.isNaN(index)) {// eslint-disable-line
            const item = this.items[index];
            if (item) {
                return item[this._getValueFieldName()];
            }
        }

        return null;
    }
    getIndexByKey(key) {
        return this.keys.indexOf(key);
    }
    hasItemWithIndex(index) {
        return this.items.length > index;
    }
    /**
     * returns the first value that matches a given key
     * @param {string} key
     * @returns {string}
     */
    getValueByKey(key) {
        if (!key) {
            return null;
        }

        const res = this.valuesFromKeys([key]);
        if (_.isArrayNotEmpty(res)) {
            return res[0];
        }

        return null;
    }
    hasKey(key) {
        return key in this.keyMap();
    }
    hasValue(value) {
        return value in this.valueMap();
    }
    keyMap() {
        if (!this._cache.keyMap) {
            this._cache.keyMap = _.invert(this.keys);
        }

        return this._cache.keyMap;
    }
    valueMap() {
        if (!this._cache.valueMap) {
            this._cache.valueMap = _.invert(this.values);
        }

        return this._cache.valueMap;
    }
    get id() {
        return this.keys.join(':');
    }
    /**
     * Get the param name from the respective key
     * @param {*} paramName the name of the object param
     * @param {*} paramValue the value to be converted
     * @param {*} paramTo the name of the obhect param to be converted
     */
    getAttibuteFromKey(key, paramTo) {
        return this.getAttibuteFromAtribute(key, 'key', paramTo);
    }
    /**
     * Converts a param to another param of the object
     * @param {*} paramName the name of the object param
     * @param {*} paramValue the value to be converted
     * @param {*} paramTo the name of the obhect param to be converted
     */
    getAttibuteFromAtribute(valueFrom, paramFrom, paramTo) {
        if (!_.isArrayNotEmpty(this.items)) {
            return null;
        }
        const item = this.items.filter(it => it[paramFrom] === valueFrom);
        if (!_.isArrayNotEmpty(item)) {
            return null;
        }
        return item[0][paramTo];
    }
    getByKey(key) {
        if (!this._cache.key2item) {
            this._cache.key2item = this.items.reduce((result, item) => {
                result[item.key] = item;
                return result;
            }, {});
        }

        return this._cache.key2item[key] || null;
    }

    prepareItem(item) {
        return item;
    }

    append(item) {
        this.items.push(this.prepareItem(item));
        this.invalidateCache();
    }

    prepend(item) {
        this.items.unshift(item);
        this.invalidateCache();
    }

    invalidateCache() {
        this._cache = {};
    }

    getNext(key) {
        const index = this.getIndexByKey(key);
        if (index < this.items.length - 1) {
            return this.getKeyByIndex(index + 1);
        }
        return null;
    }

    getPrevious(key) {
        const index = this.getIndexByKey(key);
        if (index > 0) {
            return this.getKeyByIndex(index - 1);
        }
        return null;
    }

    getLength() {
        return this.items.length;
    }

    async pumpUp() {
        return true;
    }

    async pumpUpPart() {
        return true;
    }

    isNotEmpty() {
        return this.items.length > 0;
    }

    make(items) {
        return new this.constructor(items);
    }

    getSubRange(range) {
        const result = [];

        if (!_.isObjectNotEmpty(range)) {
            return result;
        }

        for (let k = range.from; k <= range.to; k++) {
            if (this.items[k]) {
                result.push(this.items[k]);
            }
        }

        return result;
    }

    sample(n = 1) {
        return _.sample(this.items, n);
    }

    getKeysValues() {
        return this.items.map((item) => {
            return {
                key: item.key,
                value: item[this._getValueFieldName()],
            };
        });
    }
}
