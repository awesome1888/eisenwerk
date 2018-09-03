import Settings from '../../util/settings/client.js';
import Authorization from '../../util/authorization/client.js';

import Entity from '../../../lib/entity/client.js';
import Method from '../../../lib/util/method/client.js';

import feathers from '@feathersjs/client';
import rest from '@feathersjs/rest-client';

export default class Application {

    _ui = null;

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

            // we are going to use jQuery transport library ONLY because we already have jQuery in the project
            // see other options in
            // https://docs.feathersjs.com/api/client/rest.html
            app.configure(restClient.jquery($));

            Authorization.prepare(app);

            app.on('authenticated', this.onLogin.bind(this));
            app.on('logout', this.onLogout.bind(this));
            app.on('reauthentication-error', this.onReLoginError.bind(this));

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
     * Returns an instance of a "UI" application, which manages the way of displaying the information to use end user
     * @returns {*|null}
     */
    getUI() {
        return this._ui;
    }

    /**
     * Should return current or new redux store
     * @returns {null}
     */
    getStore() {
        return null;
    }

    /**
     * Returns current settings manager, which provides methods like .isProduction() or .getRootURL()
     * @returns {*}
     */
    getSettings() {
        return Settings.getInstance();
    }

    isProduction() {
        return this.getSettings().isProduction();
    }

    /**
     * USE WITH CAUTION
     * Just a shortcut to the user stored in the redux store.
     * Beware: having the current user in the store DOES NOT MEAN the user is authorized: the token could be easily
     * invalid or expired. To check whether the token is valid or not, use getUser() method from the Authorization class.
     * @returns {{}|null}
     */
    getUser() {
        const store = this.getStore();

        if (store) {
            return store.getState().global.user;
        }

        return {};
    }

    /**
     * USE WITH CAUTION
     * @returns {boolean}
     */
    hasUser() {
        return !_.isEmpty(this.getUser());
    }

    /**
     * Reloads current users data
     * @returns {Promise<void>}
     */
    async reloadUser() {
        try {
            this.getUI().setUser(await this.getAuthorization().getUser());
        } catch(e) {
        }
    }

    async onLogin() {
        this.reloadUser();
    }

    onLogout() {
        this.getUI().setUser({});
    }

    onReLoginError() {
        this.getUI().setUser({});
    }

    async execute(name, args) {
        return Method.execute(name, args);
    }
}
