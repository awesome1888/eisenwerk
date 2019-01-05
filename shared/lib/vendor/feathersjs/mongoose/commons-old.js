const pick = require('lodash.pick');
const isObject = require('lodash.isobject');
const each = require('lodash.foreach');

exports.select = function select(params, ...otherFields) {
    const fields = params && params.query && params.query.$select;

    if (Array.isArray(fields) && otherFields.length) {
        fields.push(...otherFields);
    }

    const convert = result => {
        if (!Array.isArray(fields)) {
            return result;
        }

        return pick(result, ...fields);
    };

    return result => {
        if (Array.isArray(result)) {
            return result.map(convert);
        }

        return convert(result);
    };
};

function parse(number) {
    if (typeof number !== 'undefined') {
        return Math.abs(parseInt(number, 10));
    }
}

// Returns the pagination limit and will take into account the
// default and max pagination settings
function getLimit(limit, paginate) {
    if (paginate && paginate.default) {
        const lower = typeof limit === 'number' ? limit : paginate.default;
        const upper =
            typeof paginate.max === 'number' ? paginate.max : Number.MAX_VALUE;

        return Math.min(lower, upper);
    }

    return limit;
}

// Makes sure that $sort order is always converted to an actual number
function convertSort(sort) {
    if (typeof sort !== 'object' || Array.isArray(sort)) {
        return sort;
    }

    return Object.keys(sort).reduce((result, key) => {
        result[key] =
            typeof sort[key] === 'object' ? sort[key] : parseInt(sort[key], 10);

        return result;
    }, {});
}

function cleanQuery(query, operators) {
    if (isObject(query)) {
        const result = {};
        each(query, (query1, key) => {
            if (key[0] === '$' && operators.indexOf(key) === -1) return;
            result[key] = cleanQuery(query1, operators);
        });
        return result;
    }

    return query;
}

function assignFilters(object, query, filters, options) {
    if (Array.isArray(filters)) {
        each(filters, key => {
            object[key] = query[key];
        });
    } else {
        each(filters, (converter, key) => {
            object[key] = converter(query[key], options);
        });
    }

    return object;
}

const FILTERS = {
    $sort: value => convertSort(value),
    $limit: (value, options) => getLimit(parse(value), options.paginate),
    $skip: value => parse(value),
    $select: value => value,
};

const OPERATORS = ['$in', '$nin', '$lt', '$lte', '$gt', '$gte', '$ne', '$or'];

// Converts Feathers special query parameters and pagination settings
// and returns them separately a `filters` and the rest of the query
// as `query`
exports.filterQuery = function filterQuery(query, options = {}) {
    const {
        filters: additionalFilters = {},
        operators: additionalOperators = [],
    } = options;
    const result = {};

    result.filters = assignFilters({}, query, FILTERS, options);
    result.filters = assignFilters(
        result.filters,
        query,
        additionalFilters,
        options,
    );

    result.query = cleanQuery(query, OPERATORS.concat(additionalOperators));

    return result;
};
