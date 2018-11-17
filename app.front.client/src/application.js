import BaseApplication from './shared/lib/application/client/feathers.js';

import React from 'react';
import { Provider } from 'react-redux';
import Store from './shared/lib/store';

import ApplicationUI from './components/Application';
import applicationReducer, { initial as applicationInitial } from './components/Application/reducer';
import applicationSaga from './components/Application/saga';
import { createBrowserHistory, createMemoryHistory } from 'history';
import { ConnectedRouter } from 'connected-react-router';

import pages from './pages';

/**
 * todo: move this to lib
 */
export default class Application extends BaseApplication {

    static getPages() {
        return pages;
    }

    getStore() {
        if (!this._store) {
            const redux = this._props.redux || {};
            this._store = new Store({
                ...redux,
                application: {
                    reducer: applicationReducer,
                    saga: applicationSaga,
                    initial: applicationInitial,
                },
                pages: this.getPages(),
                history: this.getHistory(),
            });
            this._store.init();
        }

        return this._store;
    }

    getHistory() {
        if (!this._history) {
            let history = null;
            if (__SSR__) {
                history = createMemoryHistory({
                    initialEntries: [this.getCurrentURL()]
                });
            } else {
                history = createBrowserHistory();
            }

            this._history = history;
        }

        return this._history;
    }

    getCurrentURL() {
        return this._props.currentURL || '/'; // tmp
    }

    /**
     * This method is available both on server and client
     * @param {children}
     * @returns {*}
     */
    render({ routes }) {
        routes = routes || null;

        return (
            <Provider store={this.getStore().getReduxStore()}>
                <ApplicationUI
                    application={this}
                    useAuth={this.useAuth()}
                >
                    <ConnectedRouter history={this.getHistory()}>
                        {routes}
                    </ConnectedRouter>
                </ApplicationUI>
            </Provider>
        );
    }

    async teardown() {
        if (this._store) {
            this._store.shutdown();
        }
    }
}
