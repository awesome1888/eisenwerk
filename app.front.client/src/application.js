import BaseApplication from './shared/lib/application/client/feathers.js';

import React from 'react';
import { Provider } from 'react-redux';
import UIApplication from './components/Application/index.jsx';

import store from './store'; // todo: ssr memory leak!

export default class Application extends BaseApplication {
    getUI() {
        return (
            <Provider store={store}>
                <UIApplication
                    application={this}
                    useAuth={this.useAuth()}
                />
            </Provider>
        );
    }
}
