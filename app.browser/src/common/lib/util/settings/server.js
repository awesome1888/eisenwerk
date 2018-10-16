import process from 'process';

export default class Settings {

    static getInstance() {
        return new this();
    }

    getPort() {
        return this._getSource().PORT || 3000;
    }

    getRootUrl() {
        return this._getSource().ROOT_URL || '';
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

    getGenderAPIToken() {
        return this._getSource().GENDER_API_TOKEN || '';
    }

    getFilepickerToken() {
        return this._getSource().FILE_PICKER_KEY || '';
    }

    prepareForClient() {
        return JSON.stringify({
            ROOT_URL: this.getRootUrl(),
            API_URL: this.getAPIURL(),
            IS_PRODUCTION: this.isProduction(),
            FILE_PICKER_KEY: this.getFilepickerToken()
        });
    }

    _getSource() {
        return process.env || {};
    }
}
