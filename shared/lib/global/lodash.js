const isArrayLike = require('lodash.isarraylike');
const isString = require('lodash.isstring');
const isObject = require('lodash.isobject');
const isNumber = require('lodash.isnumber');
const isFunction = require('lodash.isfunction');
const union = require('lodash.union');
const get = require('lodash.get');
const cloneDeep = require('lodash.clonedeep');
const deepFreeze = require('deep-freeze-node');
const isEqual = require('lodash.isequal');

module.exports = {
    isArray: isArrayLike,
    isObject,
    isArrayNotEmpty: (arg) => {
        return isArrayLike(arg) && arg.length > 0;
    },
    isStringNotEmpty: (arg) => {
        return isString(arg) && arg.length > 0;
    },
    isObjectNotEmpty: (arg) => {
        return isObject(arg) && Object.keys(arg).length > 0;
    },
    contains: (where, what) => {
        if (!isArrayLike(where)) {
            return false;
        }

        return where.indexOf(what) >= 0;
    },
    forEach: (obj, fn) => {
        Object.keys(obj).forEach((k) => {
            fn(obj[k], k);
        });
    },
    isEqual,
    isNumber,
    isFunction,
    cloneDeep,
    deepClone: cloneDeep, // compatibility
    get,
    getValue: get, // compatibility
    deepFreeze,
    union,
};
