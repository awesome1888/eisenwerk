class Settings {

    _getSource() {
        return window.__SETTINGS__ || {};
    }

    getRootURL() {
        return this._getSource().ROOT_URL || '';
    }

    getAPIURL() {
        return (this._getSource().API_URL || '').replace(/\/+$/, '');
    }

    isProduction() {
        return !!this._getSource().IS_PRODUCTION;
    }
}

export default new Settings();
