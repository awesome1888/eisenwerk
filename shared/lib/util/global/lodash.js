import isArrayLike from 'lodash.isarraylike';
import isString from 'lodash.isstring';
import isObject from 'lodash.isobject';
import isNumber from 'lodash.isnumber';
import isFunction from 'lodash.isfunction';
import get from 'lodash.get';
import cloneDeep from 'lodash.clonedeep';
import isEqual from 'lodash.isequal';

const lodash = {
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

export default lodash;
