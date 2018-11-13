import BaseApplication from './shared/lib/application/client/feathers.js';

import React from 'react';
import { Provider } from 'react-redux';
import Store from './shared/lib/store';

import UIApplication from './components/Application';
import mainReducer from './components/Application/reducer';
import pages from './pages';

export default class Application extends BaseApplication {

    static getPages() {
        return pages;
    }

    getStore() {
        if (!this._store) {
            this._store = Store.make({
                mainReducer,
                pages: this.getPages(),
            });
        }

        return this._store;
    }

    getUI() {
        return (
            <Provider store={this.getStore().getReduxStore()}>
                <UIApplication
                    application={this}
                    useAuth={this.useAuth()}
                />
            </Provider>
        );
    }

    async teardown() {
        if (this._store) {
            this._store.shutdown();
        }
    }
}
