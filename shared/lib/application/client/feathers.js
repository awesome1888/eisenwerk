import settings from '../../settings/client.js';
import Authorization from '../../authorization/client.js';

import Entity from '../../../lib/entity/client.js';
import Method from '../../method/client.js';

import feathers from '@feathersjs/client';
import rest from '@feathersjs/rest-client';
import axios from 'axios';

export default class Application {

    useAuth() {
        // todo: bring this flag from the ENV vars
        return true;
    }

    launch() {
        // tell all entities to use this network as default when making REST calls (this is important)
        Entity.setNetwork(this.getNetwork());
        Method.setNetwork(this.getNetwork());
    }

    /**
     * Returns an instance of a "network" application, which manages REST, WebSocket
     * and other stuff that provides the client-server communications
     * @returns {*}
     */
    getNetwork() {
        if (!this._feathers) {
            const app = feathers();

            // https://docs.feathersjs.com/api/client/rest.html
            const restClient = rest(this.getSettings().getAPIURL());

            // see other options in
            // https://docs.feathersjs.com/api/client/rest.html
            app.configure(restClient.axios(axios));

            if (this.useAuth()) {
                Authorization.prepare(app);

                // todo: connect it to the store
                app.on('authenticated', this.onLogin.bind(this));
                app.on('logout', this.onLogout.bind(this));
                app.on('reauthentication-error', this.onReLoginError.bind(this));
            }

            this._feathers = app;
        }

        return this._feathers;
    }

    getAuthorization() {
        if (!this._authorization) {
            this._authorization = new Authorization(this.getNetwork(), this.getSettings());
        }

        return this._authorization;
    }

    /**
     * Returns current settings manager, which provides methods like .isProduction() or .getRootURL()
     * @returns {*}
     */
    getSettings() {
        return settings;
    }

    isProduction() {
        return this.getSettings().isProduction();
    }

    async onLogin() {
        // todo: dispatch an action
    }

    onLogout() {
        // todo: dispatch an action
    }

    onReLoginError() {
        // todo: dispatch an action
    }
}
