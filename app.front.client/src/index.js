import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import Application from './application';

import { Switch } from 'react-router';
import { ConnectedRouter } from 'connected-react-router';
import Route from './shared/components/Route';

const application = new Application();
application.launch().then(() => {

    ReactDOM.render(
      application.render({
          children: (
              <ConnectedRouter history={application.getHistory()}>
                  <Switch>
                      {application.getRoutes().map(route => (
                          <Route
                              {...route}
                              key={route.path}
                          />
                      ))}
                  </Switch>
              </ConnectedRouter>
          )
      }),
      document.getElementById('root')
    );

});
