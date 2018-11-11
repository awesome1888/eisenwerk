class Settings {

    constructor() {
        this.env = window.__SETTINGS__ || {};
    }

    getRootURL() {
        return this.env.URL__ROOT || '';
    }

    getAPIURL() {
        return (this.env.URL__API || '').replace(/\/+$/, '');
    }

    isProduction() {
        return !!this.env.PRODUCTION;
    }
}

export default new Settings();
