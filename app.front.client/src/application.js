import BaseApplication from './shared/lib/application/client/feathers.js';

import React from 'react';
import { Provider } from 'react-redux';
import Store from './shared/lib/store';

import ApplicationUI from './components/Application';
import applicationReducer, { initial as applicationInitial } from './components/Application/reducer';
import applicationSaga from './components/Application/saga';

import pages from './pages';
import routes from './routes';

export default class Application extends BaseApplication {

    static getPages() {
        return pages;
    }

    static getRoutes() {
        return routes;
    }

    getStore() {
        if (!this._store) {
            this._store = Store.make({
                application: {
                    reducer: applicationReducer,
                    saga: applicationSaga,
                    initial: applicationInitial,
                },
                pages: this.getPages(),
                alterMiddleware: this._reduxSettings.alterMiddleware,
                alterReducers: this._reduxSettings.alterReducers,
            });
        }

        return this._store;
    }

    /**
     * This method is available both on server and client
     * @param {children}
     * @returns {*}
     */
    render({ children }) {
        children = children || null;

        console.dir('RENDER!');
        return (
            <Provider store={this.getStore().getReduxStore()}>
                <ApplicationUI
                    application={this}
                    useAuth={this.useAuth()}
                >
                    {children}
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
