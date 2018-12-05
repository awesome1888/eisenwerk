import process from 'process';
import parse from 'url-parse';

class Settings {
    constructor() {
        this.env = process.env;
    }

    checkMandatory() {
        const missing = [];
        if (!_.isStringNotEmpty(this.getRootURL())) {
            missing.push('URL__ROOT');
        }
        if (!_.isStringNotEmpty(this.getPort())) {
            missing.push('PORT');
        }
        if (_.isArrayNotEmpty(missing)) {
            console.error(
                `You have the following environment variables missing: ${missing.join(
                    ', ',
                )}. You may get into trouble with that, because some of submodules rely on these values and may work inconsistently.`,
            );
        }
    }

    getPort() {
        return this.env.PORT || 3000;
    }

    getRootURL() {
        return this.env.URL__ROOT || '';
    }

    getRootURLParsed() {
        return parse(this.getRootURL());
    }

    getPublicFolder() {
        const path = this.env.FOLDER__PUBLIC;

        if (_.isStringNotEmpty(path)) {
            return path;
        }

        return '';
    }

    getRootFolder() {
        return this.env.FOLDER__ROOT || '';
    }

    getTemplateFolder() {
        return this.env.FOLDER__TEMPLATE || '';
    }

    getAssetsFilePath() {
        return this.env.FILE__TEMPLATE__ASSETS || '';
    }

    getDatabaseURL() {
        return this.env.URL__DB || '';
    }

    // todo: this is just ugly, the API server should be client-agnostic, but since otherwise we cant make
    // todo: oauth work, the only way is to let the server know about its clients
    getClientURL() {
        return this.env.URL__CLIENT_ORIGIN || '';
    }

    getAPIURL() {
        return this.env.URL__API || '';
    }

    isProduction() {
        return (
            !__DEV__ &&
            this.env.NODE_ENV !== 'development' &&
            this.env.NODE_ENV !== 'test'
        );
    }

    isDevelopment() {
        return !this.isProduction();
    }

    getAllowedOrigins() {
        const origins = this.env.CORS__ORIGIN;
        if (_.isStringNotEmpty(origins)) {
            return origins.split(',').map(x => x.trim());
        }

        return null;
    }

    getSecret() {
        return this.env.AUTH__SECRET || '';
    }

    getOAuthGoogleClientId() {
        return this.env.AUTH__GOOGLE__CLIENT_ID || '';
    }

    getOAuthGoogleSecret() {
        return this.env.AUTH__GOOGLE__SECRET || '';
    }

    useSSR() {
        return this.env.SSR__ENABLED !== '0';
    }

    getSSRCacheURL() {
        return this.env.SSR__CACHE__URL || '';
    }

    getProjectName() {
        return this.env.PROJECT__NAME || '';
    }

    prepareForClient() {
        return JSON.stringify({
            URL__ROOT: this.getRootURL(),
            URL__API: this.getAPIURL(),
            PRODUCTION: this.isProduction(),
        });
    }
}

const settings = new Settings();
export default settings;
