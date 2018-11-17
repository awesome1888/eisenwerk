import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import Application from './application';
import { Switch } from 'react-router';

import routes from './routes';
import Route from './shared/components/Route';

const application = new Application({
    redux: {
        initialState: window.__STATE__,
    },
});

delete window.__STATE__;

application.launch().then(() => {

    ReactDOM.render(
      application.render({
          routes: (
              <Switch>
                  <Route
                      {...routes[0]}
                  />
                  <Route
                      {...routes[1]}
                  />
              </Switch>
          )
      }),
      document.getElementById('root')
    );

});
