const isArrayLike = require('lodash.isarraylike');
const isString = require('lodash.isstring');
const isObject = require('lodash.isobject');
const isNumber = require('lodash.isnumber');
const isFunction = require('lodash.isfunction');
const get = require('lodash.get');
const cloneDeep = require('lodash.clonedeep');
const isEqual = require('lodash.isequal');

module.exports = {
    isArray: isArrayLike,
    isArrayNotEmpty: (arg) => {
        return isArrayLike(arg) && arg.length > 0;
    },
    isStringNotEmpty: (arg) => {
        return isString(arg) && arg.length > 0;
    },
    isObjectNotEmpty: (arg) => {
        return isObject(arg) && Object.keys(arg).length > 0;
    },
    isEqual,
    isNumber,
    isFunction,
    cloneDeep,
    get,
};
