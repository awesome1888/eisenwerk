/**
 * Auxiliary class, put all general helpers here. Feel free to make a scrap-yard here.
 */
export default class Util {

    // static ensureUrlProtocolPresent(url) {
    //     if (!_.isStringNotEmpty(url)) {
    //         return '';
    //     }
    //     if (url.substring(0, 7) === 'http://' || url.substring(0, 8) === 'https://') {
    //         return url;
    //     }
    //     return `http://${url}`;
    // }

    // static getAlphabeticalComparator() {
    //     if ('localeCompare' in String.prototype) {
    //         return (a, b) => {
    //             return a && a.localeCompare(b);
    //         };
    //     } else {
    //         return (a, b) => {
    //             if (a < b) return -1;
    //             if (a > b) return 1;
    //             return 0;
    //         };
    //     }
    // }

    // static escapeRegExp(text) {
    //     return _.isString(text) && text.trim().replace(/[-[\]{}()&*+?.\\/^$|#\s]/g, '\\$&');
    // }

    // static attachSearchCondition(
    //     filter,
    //     value,
    //     fieldsFull = [],
    //     fieldsPartial = [],
    //     additionalConditions = []
    // ) {
    //     if (_.isString(value) && value.length > 0) {
    //         const subFilter = [];
    //
    //         if (_.isArrayNotEmpty(fieldsFull)) {
    //             fieldsFull.forEach((field) => {
    //                 const obj = {};
    //                 obj[field] = {$regex: this.escapeRegExp(value), $options: 'i'};
    //                 subFilter.push(obj);
    //             });
    //         }
    //
    //         if (_.isArrayNotEmpty(fieldsPartial)) {
    //             const toSearch = value.split(',');
    //
    //             fieldsPartial.forEach((field) => {
    //                 const or = [];
    //                 _.each(toSearch, (one) => {
    //                     const obj = {};
    //                     obj[field] = {$regex: this.escapeRegExp(one), $options: 'i'};
    //                     or.push(obj);
    //                 });
    //
    //                 subFilter.push({$or: or});
    //             });
    //         }
    //
    //         if (_.isArrayNotEmpty(additionalConditions)) {
    //             additionalConditions.forEach((condition) => {
    //                 subFilter.push(condition);
    //             });
    //         }
    //
    //         if (_.isArrayNotEmpty(subFilter)) {
    //             this.attachMandatoryCondition(filter, {$or: subFilter});
    //         }
    //     }
    //
    //     return filter;
    // }

    // static attachMandatoryCondition(filter, condition) {
    //     if (_.isObject(filter)) {
    //         filter.$and = filter.$and || [];
    //         filter.$and.push(condition);
    //     }
    // }

    // static parseQueryString(url = '') {
    //     if (!url) {
    //         url = window.location.search;
    //     }
    //     return qs.parse(url);
    // }
}
