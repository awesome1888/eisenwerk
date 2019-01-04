const isArrayLike = require('lodash.isarraylike');
const isString = require('lodash.isstring');
const isObject = require('lodash.isobject');
const isNumber = require('lodash.isnumber');
const isFunction = require('lodash.isfunction');
const union = require('lodash.union');
const get = require('lodash.get');
const set = require('lodash.set');
const cloneDeep = require('lodash.clonedeep');
const deepFreeze = require('deep-freeze-node');
const isEqual = require('lodash.isequal');
const intersectKeys = require('object.intersect');

const isne = arg => {
    return isString(arg) && arg.length > 0;
};

const iane = arg => {
    return isArrayLike(arg) && arg.length > 0;
};

const ione = arg => {
    return isObject(arg) && Object.keys(arg).length > 0;
};

module.exports = {
    isArray: isArrayLike,
    isObject,
    isArrayNotEmpty: iane,
    iane,
    isStringNotEmpty: isne,
    isne,
    isObjectNotEmpty: ione,
    ione,
    contains: (where, what) => {
        if (!isArrayLike(where)) {
            return false;
        }

        return where.indexOf(what) >= 0;
    },
    forEach: (obj, fn) => {
        Object.keys(obj).forEach(k => {
            fn(obj[k], k);
        });
    },
    isEqual,
    isNumber,
    isFunction,
    cloneDeep,
    deepClone: cloneDeep, // compatibility
    get,
    set,
    getValue: get, // compatibility
    deepFreeze,
    union,
    intersectKeys,
    mergeShallow: (one, two) => {
        const res = {};
        const kOne = Object.keys(one);
        const kTwo = Object.keys(two);

        for (let k = 0; k < kOne.length; k++) {
            res[kOne[k]] = one[kOne[k]];
        }
        for (let k = 0; k < kTwo.length; k++) {
            res[kTwo[k]] = two[kTwo[k]];
        }

        return res;
    },
};
