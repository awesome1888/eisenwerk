import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import Application from './application';

import { Switch } from 'react-router';
import { ConnectedRouter, routerMiddleware, connectRouter } from 'connected-react-router';
import { createBrowserHistory } from 'history';
import Route from './shared/components/Route';

const history = createBrowserHistory();

const application = new Application({
    redux: {
        alterMiddleware: () => [routerMiddleware(history)],
        alterReducers: reducers => connectRouter(history)(reducers),
    },
});

const routes = application.getRoutes();
// console.dir({...routes[0]});
// console.dir({...routes[1]});

application.launch().then(() => {

    ReactDOM.render(
      application.render({
          children: (
              <ConnectedRouter history={history}>
                  <Switch>
                      <Route
                          path="/"
                          exact
                          render={routes[0].render}
                          key={1}
                      />
                      <Route
                          path="/list"
                          render={routes[1].render}
                          key={2}
                      />

                      {/*{application.getRoutes().map(route => (*/}
                          {/*<Route*/}
                              {/*{...route}*/}
                              {/*key={route.path}*/}
                          {/*/>*/}
                      {/*))}*/}
                  </Switch>
              </ConnectedRouter>
          )
      }),
      document.getElementById('root')
    );

});
