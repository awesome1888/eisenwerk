import BaseApplication from '../../common/lib/application/client/base-feathers.js';

import React from 'react';
import ReactDOM from 'react-dom';
import UIApplication from '../../ui/application.jsx';

import Store from '../../store/index.js';

export default class Application extends BaseApplication {
    launch() {
        super.launch();

        // make global modules visible in the browser
        window._ = _;
        window.mern = mern;
        window.t = t;

        // set the reference to the app in order to access it project-wide
        // through mern.app()
        mern.setApp(this);

        ReactDOM.render(
            <UIApplication
                application={this}
                dataStore={this.getStore()}
                ref={(ref) => { this._ui = ref; }}
            />,
            document.getElementById('root')
        );
    }

    getStore() {
        if (!this._store) {
            this._store = Store.create();
        }

        return this._store;
    }
}
