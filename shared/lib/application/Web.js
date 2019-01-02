import { createBrowserHistory, createMemoryHistory } from 'history';

import Store from '../store';
import Settings from '../settings/client.js';

export default class WebApplication {
    constructor(params = {}) {
        this._params = params || {};
        this._settings = new Settings(this._params.settings);
    }

    useAuth() {
        return this.getSettings().useAuth();
    }

    isSSR() {
        return !!this.getParams().ssr;
    }

    async launch() {
        // if (this.isSSR()) {
        //     const Storage = (await import('node-storage-shim')).default;
        //     this._storage = new Storage();
        // } else {
        //     this._storage = window.localStorage;
        // }
    }

    getMainStoreElement() {
        return {
            reducer: null,
            saga: null,
        };
    }

    getRoutes() {
        return null;
    }

    getStore() {
        if (!this._store) {
            const redux = this._params.redux || {};
            this._store = new Store({
                ...redux,
                application: this.getMainStoreElement(),
                routes: this.getRoutes(),
                history: this.getHistory(),
                ssr: this.isSSR(),
                dev: !this.getSettings().isProduction(),
            });
            this._store.init();
        }

        return this._store;
    }

    getHistory() {
        if (!this._history) {
            let history = null;
            if (this.isSSR()) {
                history = createMemoryHistory({
                    initialEntries: [this.getCurrentURL()],
                });
            } else {
                history = createBrowserHistory();
            }

            this._history = history;
        }

        return this._history;
    }

    getCurrentURL() {
        return this._params.currentURL || '/';
    }

    /**
     * Returns an instance of a "network" application, which manages REST, WebSocket
     * and other stuff that provides the client-server communications
     * @returns {*}
     */
    getNetwork() {
        return null;
    }

    renderRoutes() {
        return null;
    }

    renderError() {
        return null;
    }

    render() {
        return null;
    }

    getParams() {
        return this._params;
    }

    /**
     * Returns current settings manager, which provides methods like .isProduction() or .getRootURL()
     * @returns {*}
     */
    getSettings() {
        return this._settings;
    }

    async teardown() {
        if (this._store) {
            this._store.shutdown();
        }
    }
}
