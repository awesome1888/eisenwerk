import moment from 'moment';

export default class Index {

    _parameters = {};

    constructor(parameters) {
        this._parameters = _.isObject(parameters) ? parameters : {};
    }

    export(data) {
        const blob = new Blob([this.prepare(data)], { type: 'data:text/csv;charset=UTF-8,%ef%bb%bf'}); // eslint-disable-line
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob); // eslint-disable-line

        link.setAttribute('href', url);
        const time = moment().format('DD-MM-YYYY__HH-mm-SS');
        link.setAttribute('download', `export-${time}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    prepareCell(theValue) {
        const t = typeof (theValue);
        let output;
        if (t === 'undefined' || t === null) {
            output = '""';
        } else if (t === 'string') {
            output = `"${theValue}"`;
        } else {
            output = `"${String(theValue)}"`;
        }
        return output;
    }

    prepareLine(obj, headers = []) {
        const lineContent = [];

        if (_.isArrayNotEmpty(headers)) {
            _.each(headers, (header) => {
                lineContent.push(this.prepareCell(obj[header]));
            });
        } else {
            _.each(obj, (data) => {
                lineContent.push(this.prepareCell(data));
            });
        }

        return `${lineContent.join(',')}\n`;
    }

    prepare(array) {
        let headers = [];
        _.each(array, (it) => {
            headers = _.union(headers, _.keys(it));
        });
        let content = '';

        const headerStrings = this._parameters.header || {};
        if (_.isObjectNotEmpty(headerStrings)) {
            content = `${headers.map((col) => {
                return col in headerStrings ? headerStrings[col] : col;
            }).join(',')}\n`;
        } else {
            content = `${headers.join(',')}\n`;
        }

        _.each(array, (obj) => {
            content = `${content}${this.prepareLine(obj, headers)}\n`;
        });
        return content;
    }
}
