import BaseApplication from './shared/lib/application/client/feathers.js';

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import UIApplication from './components/Application/index.jsx';

import store from './store';

export default class Application extends BaseApplication {
    launch() {
        super.launch();
        ReactDOM.render(
            <Provider store={store}>
                <UIApplication
                    application={this}
                    ref={(ref) => { this._ui = ref; }}
                    useAuth={this.useAuth()}
                />
            </Provider>,
            document.getElementById('root')
        );
    }
}
