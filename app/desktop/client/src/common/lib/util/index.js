// import URLParse from 'url-parse';
// import moment from 'moment';
// import './../startup/both/i18n/simple-schema.js';
import qs from 'query-string';

/**
 * Auxiliary class, put all general helpers here. Feel free to make a scrap-yard here.
 */
export default class Util {

    /**
     * Check if a given url contains protocol attached. If does not, add http.
     * @param {string} url
     * @returns {string}
     */
    // static ensureUrlProtocolPresent(url) {
    //     if (!_.isStringNotEmpty(url)) {
    //         return '';
    //     }
    //     if (url.substring(0, 7) === 'http://' || url.substring(0, 8) === 'https://') {
    //         return url;
    //     }
    //     return `http://${url}`;
    // }

    // static getIfZeroCondition(field) {
    //     const one = {};
    //     one[field] = {$eq: 0};
    //
    //     const two = {};
    //     two[field] = {$eq: undefined};
    //
    //     const three = {};
    //     three[field] = {$eq: null};
    //
    //     return {
    //         $or: [one, two, three]
    //     };
    // }

    /**
     * Returns a regular expression that is similar to
     * SimpleSchema.RegEx.Email, but with two differences:
     * 1) does not allow ftp://
     * 2) makes http:// or https:// prefix optional
     * todo: btw urls like http:/google.com and //google.com are also legal
     * @returns {RegExp}
     */
    // static get httpRegExp() {
    //     return /^(?:https?:\/\/|)(?:\S+(?::\S*)?@)?(?:(?!10(?:\.\d{1,3}){3})(?!127(?:\.\d{1,3}){3})(?!169\.254(?:\.\d{1,3}){2})(?!192\.168(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/[^\s]*)?$/i;
    // }

    static get phoneRegExp() {
        return /^[+＋]?[0-9 ]*$/;
    }

    // static attachMostlyUndefinedTrueCondition(filter, field, value) {
    //     if (value === true) {
    //         filter[field] = {$eq: true};
    //     } else {
    //         const one = {};
    //         one[field] = {$ne: true};
    //
    //         const two = {};
    //         two[field] = {$exists: false};
    //
    //         const three = {};
    //         three[field] = {$eq: null};
    //
    //         filter.$or = [one, two, three];
    //     }
    // }

    // static extractBooleanValue(name, source, defaultValue = true) {
    //     let result = defaultValue;
    //     if (name in source) {
    //         result = source[name];
    //     }
    //
    //     return !!result;
    // }

    static getAlphabeticalComparator() {
        if ('localeCompare' in String.prototype) {
            return (a, b) => {
                return a && a.localeCompare(b);
            };
        } else {
            return (a, b) => {
                if (a < b) return -1;
                if (a > b) return 1;
                return 0;
            };
        }
    }

    static escapeRegExp(text) {
        return _.isString(text) && text.trim().replace(/[-[\]{}()&*+?.\\/^$|#\s]/g, '\\$&');
    }

    static attachSearchCondition(
        filter,
        value,
        fieldsFull = [],
        fieldsPartial = [],
        additionalConditions = []
    ) {
        if (_.isString(value) && value.length > 0) {
            const subFilter = [];

            if (_.isArrayNotEmpty(fieldsFull)) {
                fieldsFull.forEach((field) => {
                    const obj = {};
                    obj[field] = {$regex: this.escapeRegExp(value), $options: 'i'};
                    subFilter.push(obj);
                });
            }

            if (_.isArrayNotEmpty(fieldsPartial)) {
                const toSearch = value.split(',');

                fieldsPartial.forEach((field) => {
                    const or = [];
                    _.each(toSearch, (one) => {
                        const obj = {};
                        obj[field] = {$regex: this.escapeRegExp(one), $options: 'i'};
                        or.push(obj);
                    });

                    subFilter.push({$or: or});
                });
            }

            if (_.isArrayNotEmpty(additionalConditions)) {
                additionalConditions.forEach((condition) => {
                    subFilter.push(condition);
                });
            }

            if (_.isArrayNotEmpty(subFilter)) {
                this.attachMandatoryCondition(filter, {$or: subFilter});
            }
        }

        return filter;
    }

    static attachMandatoryCondition(filter, condition) {
        if (_.isObject(filter)) {
            filter.$and = filter.$and || [];
            filter.$and.push(condition);
        }
    }

    // static compareHashPassword(hashPassword, password) {
    //     const bcrypt = Package['npm-bcrypt'].NpmModuleBcrypt;
    //     const bcryptCompare = Meteor.wrapAsync(bcrypt.compare);
    //     return bcryptCompare(hashPassword, password);
    // }

    // static b64EncodeUnicode(str) {
    //     // return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (match, p1) => {
    //     //     return String.fromCharCode(`0x${p1}`);
    //     // }));
    //     return btoa(str);
    // }

    // static b64DecodeUnicode(str) {
    //     // return decodeURIComponent(Array.prototype.map.call(atob(str),
    //     //     c => `%00${c.charCodeAt(0).toString(16)}`.slice(-2)).join(''));
    //     return atob(str);
    // }

    // static SHA256(password) {
    //     return Package.sha.SHA256(password);
    // }

    // static hashPasswordBcrypt(hashPasswordSHA256) {
    //     const bcrypt = Package['npm-bcrypt'].NpmModuleBcrypt;
    //     const bcryptHash = Meteor.wrapAsync(bcrypt.hash);
    //     return bcryptHash(hashPasswordSHA256, Accounts._bcryptRounds);
    // }

    /**
     * Checks if the specified password belongs to the specified user
     *
     * @param user User data structure from the database
     * @param hashPassword The plain-text password pre-hashed with sha256
     * @returns {boolean}
     */
    // static checkUserPassword(user, hashPassword) {
    //     const result = Accounts._checkPassword(user, {digest: hashPassword, algorithm: 'sha-256'});
    //     return !_.isObject(result.error);
    // }

    // todo: remove these CSV methods in favour of the CSV exporter (see the old app)
    // static toCSVValue(theValue) {
    //     const t = typeof (theValue);
    //     let output;
    //     if (t === 'undefined' || t === null) {
    //         output = '""';
    //     } else if (_.isDate(theValue)) {
    //         output = `"${moment(theValue).format('DD/MM/YYYY HH:mm:SS')}"`;
    //     } else if (t === 'string') {
    //         output = `"${theValue.replace(/(?:\r\n|\r|\n)/g, '').replace(/"/g, '""')}"`;
    //     } else {
    //         output = `"${JSON.stringify(theValue).replace(/"/g, '""')}"`;
    //     }
    //     return output;
    // }
    //
    // static toCSV(array, parameters = {}) {
    //
    //     let content = '';
    //     // parameters.header contains labels for each column
    //     const headerStrings = parameters.header || {};
    //     const headerLayout = parameters.columns || [];
    //
    //     let headers = [];
    //
    //     if (!_.isArrayNotEmpty(headerLayout)) {
    //         _.each(array, (it) => {
    //             headers = _.union(headers, _.keys(it));
    //         });
    //     } else {
    //         headers = headerLayout;
    //     }
    //
    //     if (_.isObjectNotEmpty(headerStrings)) {
    //         const value = headers.map((col) => {
    //             return col in headerStrings ? headerStrings[col] : col;
    //         }).join(',');
    //         content = `${value}\n`;
    //     } else {
    //         content = `${headers.join(',')}\n`;
    //     }
    //
    //     _.each(array, (obj) => {
    //         const lineContent = [];
    //         _.each(headers, (header) => {
    //             lineContent.push(this.toCSVValue(obj[header]));
    //         });
    //         content = `${content}${lineContent.join(',')}\n`;
    //     });
    //     return content;
    // }
    //
    // static toCSVObject(obj, path) {
    //     if (path === undefined) {
    //         path = '';
    //     }
    //     if (_.isUndefined(obj) || _.isNull(obj)) {
    //         const newObj = {};
    //         const endPath = path.substr(0, path.length - 1);
    //         newObj[endPath] = '';
    //         return newObj;
    //     } else if (_.isArray(obj)) {
    //         if (obj && obj[0] && _.isObject(obj[0])) {
    //             const newObj = {};
    //             obj.forEach((i, index) => {
    //                 const newD = this.toCSVObject(i, `${path}${index}.`);
    //                 _.extend(newObj, newD);
    //             });
    //             return newObj;
    //         } else {
    //             const newObj = {};
    //             const endPath = path.substr(0, path.length - 1);
    //             newObj[endPath] = obj.join(this.SEPARATOR_CHAR);
    //             return newObj;
    //         }
    //     } else if (_.isDate(obj)) {
    //         const newObj = {};
    //         const endPath = path.substr(0, path.length - 1);
    //         newObj[endPath] = moment(obj).format('DD/MM/YYYY HH:mm:SS');
    //         return newObj;
    //     } else if (_.isObject(obj)) {
    //         const newObj = {};
    //         _.keys(obj).forEach((i) => {
    //             const newD = this.toCSVObject(obj[i], `${path}${i}.`);
    //             _.extend(newObj, newD);
    //         });
    //         return newObj;
    //     } else if (_.isNumber(obj) || _.isString(obj) || _.isBoolean(obj)) {
    //         const newObj = {};
    //         const endPath = path.substr(0, path.length - 1);
    //         newObj[endPath] = obj;
    //         return newObj;
    //     }
    //     return {};
    // }

    static findClosestParent(node, selector) {
        let depth = 0;
        while (node && depth < 50) {
            if ($(node).is(selector)) {
                return node;
            }
            node = node.parentElement;
            depth += 1;
        }

        return null;
    }

    static parseUrl(url = '') {
        if (!url) {
            url = window.location.search;
        }
        return qs.parse(url);
    }

    // static getBackPath(url) {
    //     const path = FlowRouter.current().path;
    //     if (path) {
    //         const character = _.contains(url, '?') ? '&' : '?';
    //         return `${url}${character}backUrl=${encodeURIComponent(path)}`;
    //     }
    //     return url;
    // }

    // static makeSearch(cb) {
    //     let prevValue = null;
    //     return _.debounce(function(value) {
    //         if (value === prevValue) {
    //             return;
    //         }
    //
    //         prevValue = value;
    //
    //         cb(value);
    //     });
    // }

    /**
     * auxiliary function to format a list in a an html excerpt
     * @param {*} strings
     */
    // static formatToHtml(strings) {
    //     if (_.isArrayNotEmpty(strings)) {
    //         const string = strings.join('</strong>, <strong>');
    //         // replace last comma for the word 'and'
    //         return `<strong>${string}</strong>`.replace(/,([^,]*)$/, ' und$1');
    //     }
    //     return null;
    // }

    static formatNumber(number) {
        if (!_.isString(number) && !(_.isNumber(number))) {
            return '0';
        }

        number = number.toString().trim();
        if (number.length < 4) {
            return number;
        }

        return this.inverseString(this.inverseString(number).replace(/(\d{3})/g, '$1.')).replace(/^\.{1}/, '');
    }

    /**
     * Actung! This will only work with ASCII symbols
     *
     * @protected
     * @param string
     * @returns {string}
     */
    // static inverseString(string) {
    //     return string.toString().split('').reverse().join('');
    // }

    // static downloadAsCSV(data, parameters = {}) {
    //     if (!Meteor.isClient) {
    //         return;
    //     }
    //
    //     const blob = new Blob([this.toCSV(data, parameters)], { type: 'data:text/csv;charset=UTF-8,%ef%bb%bf'}); // eslint-disable-line
    //     const link = document.createElement('a');
    //     const url = URL.createObjectURL(blob); // eslint-disable-line
    //
    //     link.setAttribute('href', url);
    //     const time = moment().format('DD-MM-YYYY__HH-mm-SS');
    //     link.setAttribute('download', `export-${time}.csv`);
    //     link.style.visibility = 'hidden';
    //     document.body.appendChild(link);
    //     link.click();
    //     document.body.removeChild(link);
    // }

    // static getRelativeUrl(url) {
    //     let urlComplete;
    //     if (Meteor.isDevelopment) {
    //         urlComplete = Meteor.absoluteUrl(url).replace('3010', '3000');
    //     } else {
    //         urlComplete = `https://app.sevenlanes.com/${url}`;
    //     }
    //     return urlComplete;
    // }

    // static isDateInPast(date) {
    //     if (!_.isDate(date)) {
    //         return true;
    //     }
    //
    //     return Date.now() - date.getTime() > 0;
    // }

    static loadJs(src) {
        const d = document;

        if (!d || !src) {
            return null;
        }

        src = src.toString().trim();

        this._loadedJs = this._loadedJs || {};

        if (this._loadedJs[src]) {
            return new Promise((resolve) => {
                resolve();
            });
        }

        const node = d.createElement('script');
        const p = new Promise((resolve) => {
            node.addEventListener('load', () => {
                this._loadedJs[src] = true;
                resolve();
            }, false);
        });

        node.type = 'text/javascript';
        node.setAttribute('async', 'async');
        node.setAttribute('defer', 'defer');
        node.src = src;

        const ctx = d.getElementsByTagName('head')[0] || d.body || d.documentElement;
        ctx.appendChild(node);

        return p;
    }

    static isId(arg) {
        if (_.isStringNotEmpty(arg)) {
            return (new RegExp('^[a-z0-9]+$', 'i')).test(arg) && (arg.length === 17 || arg.length === 24);
        }

        return false;
    }

    /**
     * Todo: this probably should be done in UTC
     * @param date
     * @returns {number}
     */
    static getAge(date) {
        return Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24 * 365));
    }

    // todo: remove this when get rid of the spike
    static findItemByIdOrIndex(i, items) {
        const itemIndex = parseInt(i, 10);

        let item = null;
        if (this.isId(i)) {
            item = items.find((it) => {
                return it._id === i;
            });
        } else if (!Number.isNaN(itemIndex)) {
            item = items[itemIndex];
        }

        return item;
    }

    static getInitials(firstName = '', lastName = '') {
        return `${firstName[0] || ''}${lastName[0] || ''}`.trim().toUpperCase();
    }

    static isMobile() {
        return /Mobi/.test(navigator && navigator.userAgent);
    }
}
