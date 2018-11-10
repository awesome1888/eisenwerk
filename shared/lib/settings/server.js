import process from 'process';
import parse from 'url-parse';

class Settings {

    checkMandatory() {
        const missing = [];
        if (!_.isStringNotEmpty(this.getRootURL())) {
            missing.push('ROOT_URL');
        }
        if (!_.isStringNotEmpty(this.getPort())) {
            missing.push('PORT');
        }
        if (_.isArrayNotEmpty(missing)) {
            console.error(`You have the following environment variables missing: ${missing.join(', ')}. You may get into trouble with that, because some of submodules rely on these values and may work inconsistently.`);
        }
    }

    getPort() {
        return this.getSource().PORT || 3000;
    }

    getRootURL() {
        return this.getSource()['URL.ROOT'] || '';
    }

    getRootURLParsed() {
        return parse(this.getRootURL());
    }

    getPublicFolder() {
        const path = this.getSource()['FOLDER.PUBLIC'];

        if (_.isStringNotEmpty(path)) {
            return path;
        }

        return '';
    }

    getRootFolder() {
        return this.getSource()['FOLDER.ROOT'] || '';
    }

    getTemplateFolder() {
        return this.getSource()['FOLDER.TEMPLATE'] || '';
    }

    getDatabaseURL() {
        return this.getSource()['URL.DB'] || '';
    }

    // todo: this is just ugly, the API server should be client-agnostic, but since otherwise we cant make
    // todo: oauth work, the only way is to let the server know about its clients
    getClientURL() {
        return this.getSource()['URL.CLIENT-ORIGIN'] || '';
    }

    getAPIURL() {
        return this.getSource()['URL.API'] || '';
    }

    isProduction() {
        return this.getSource().NODE_ENV === 'production';
    }

    getAllowedOrigins() {
        const origins = this.getSource()['CORS.ORIGIN'];
        if (_.isStringNotEmpty(origins)) {
            return origins.split(',').map(x => x.trim());
        }

        return null;
    }

    getSecret() {
        return this.getSource()['AUTH.SECRET'] || '';
    }

    getOAuthGoogleClientId() {
        return this.getSource()['AUTH.GOOGLE.CLIENT-ID'] || '';
    }

    getOAuthGoogleSecret() {
        return this.getSource()['AUTH.GOOGLE.SECRET'] || '';
    }

    useSSR() {
        return this.getSource()['SSR.ENABLED'] !== '0';
    }

    prepareForClient() {
        return JSON.stringify({
            'URL.ROOT': this.getRootURL(),
            'URL.API': this.getAPIURL(),
            PRODUCTION: this.isProduction(),
        });
    }

    getSource() {
        return process.env;
    }
}

const settings = new Settings();
export default settings;
