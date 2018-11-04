export default class Result {
    constructor() {
        this._data = {};
        this._errors = {};
    }

    isOk() {
        return !_.isArrayNotEmpty(this._errors);
    }

    setErrors(errors) {
        this._errors = errors || [];
    }

    getErrors() {
        return this._errors;
    }

    setData(data) {
        this._data = data || {};
    }

    getData() {
        return this._data;
    }
}

