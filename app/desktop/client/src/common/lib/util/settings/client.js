export default class Settings {

    static getInstance() {
        return new this();
    }

    _getSource() {
        return window.__SETTINGS__ || {};
    }

    getRootURL() {
        return this._getSource().ROOT_URL || '';
    }

    getAPIURL() {
        return (this._getSource().API_URL || '').replace(/\/+$/, '');
    }

    getFilepickerToken() {
        return this._getSource().FILE_PICKER_KEY || '';
    }

    isProduction() {
        return !!this._getSource().IS_PRODUCTION;
    }

    getFilepickerToken() {
        return this._getSource().FILE_PICKER_KEY || '';
    }
}
