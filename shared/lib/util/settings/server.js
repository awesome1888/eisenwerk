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
        return this._getSource().PORT || 3000;
    }

    getRootUrl() {
        return this._getSource().ROOT_URL || '';
    }

    getRootUrlParsed() {
        return parse(this.getRootURL());
    }

    getPublicFolder() {
        const path = this._getSource().PUBLIC_FOLDER;

        if (_.isStringNotEmpty(path)) {
            return path;
        }

        return '';
    }

    getRootFolder() {
        return this._getSource().ROOT_FOLDER || '';
    }

    getDatabaseURL() {
        return this._getSource().DB_URL || '';
    }

    // todo: this is ugly, the API server should be client-agnostic, but since otherwise we cant make
    // todo: oauth work, the only way is to let the server know about its clients
    getClientURL() {
        return this._getSource().CLIENT_ORIGIN_URL || '';
    }

    getAPIURL() {
        return this._getSource().API_URL || '';
    }

    isProduction() {
        return this._getSource().NODE_ENV === 'production';
    }

    getAllowedOrigins() {
        const origins = this._getSource().ALLOWED_ORIGINS;
        if (_.isStringNotEmpty(origins)) {
            return origins.split(',').map(x => x.trim());
        }

        return null;
    }

    getSecret() {
        return this._getSource().SECRET || '';
    }

    getOAuthGoogleClientId() {
        return this._getSource().OAUTH_GOOGLE_CLIENT_ID || '';
    }

    getOAuthGoogleSecret() {
        return this._getSource().OAUTH_GOOGLE_SECRET || '';
    }

    prepareForClient() {
        return JSON.stringify({
            ROOT_URL: this.getRootUrl(),
            API_URL: this.getAPIURL(),
            IS_PRODUCTION: this.isProduction(),
        });
    }

    _getSource() {
        return process.env;
    }
}

export default new Settings();
