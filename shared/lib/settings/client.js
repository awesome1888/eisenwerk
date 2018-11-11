class Settings {

    getSource() {
        return window.__SETTINGS__ || {};
    }

    getRootURL() {
        return this.getSource()['URL__ROOT'] || '';
    }

    getAPIURL() {
        return (this.getSource()['URL__API'] || '').replace(/\/+$/, '');
    }

    isProduction() {
        return !!this.getSource().PRODUCTION;
    }
}

export default new Settings();
