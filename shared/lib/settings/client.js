class Settings {

    _getSource() {
        return window.__SETTINGS__ || {};
    }

    getRootURL() {
        return this._getSource()['URL.ROOT'] || '';
    }

    getAPIURL() {
        return (this._getSource()['URL.API'] || '').replace(/\/+$/, '');
    }

    isProduction() {
        return !!this._getSource().PRODUCTION;
    }
}

export default new Settings();
