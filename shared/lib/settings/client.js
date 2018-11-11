class Settings {
    constructor(settings) {
        if (settings) {
            this.env = settings;
        } else {
            this.env = (window ? window.__SETTINGS__ : {}) || {};
        }
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

export default Settings;
