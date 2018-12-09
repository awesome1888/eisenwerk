class Settings {
    constructor(settings) {
        if (settings) {
            this.env = settings;
        } else {
            if (window) {
                this.env = window.__SETTINGS__ || {};
                delete window.__SETTINGS__;
            } else {
                this.env = {};
            }
        }
    }

    getRootURL() {
        return this.env.URL__ROOT || '';
    }

    getAPIURL() {
        return (this.env.URL__API || '').replace(/\/+$/, '');
    }

    useAuth() {
        return !!this.env.AUTH__ENABLED;
    }

    isSSR() {
        return !!this.env.SSR;
    }

    isProduction() {
        return !!this.env.PRODUCTION;
    }
}

export default Settings;
