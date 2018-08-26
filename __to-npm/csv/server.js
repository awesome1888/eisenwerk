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
