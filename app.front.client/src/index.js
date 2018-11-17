import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import Application from './application';

import { Switch } from 'react-router';
import { ConnectedRouter, routerMiddleware, connectRouter } from 'connected-react-router';
import { createBrowserHistory } from 'history';
import Route from './shared/components/Route';

import LayoutOuter from './components/LayoutOuter';
// import LayoutInner from "components/LayoutInner";
import { Link } from 'react-router-dom';

const history = createBrowserHistory();

const application = new Application({
    redux: {
        alterMiddleware: () => [routerMiddleware(history)],
        alterReducers: reducers => connectRouter(history)(reducers),
    },
});

const routes = application.getRoutes();

application.launch().then(() => {

    ReactDOM.render(
      application.render({
          children: (
              <ConnectedRouter history={history}>
                  <Switch>
                      <Route
                          {...routes[0]}
                      />
                      <Route
                          {...routes[1]}
                      />

                      {/*{application.getRoutes().map(route => {*/}
                          {/*console.dir(route);*/}
                          {/*return (*/}
                              {/*<Route*/}
                                  {/*{...route}*/}
                                  {/*key={route.path}*/}
                              {/*/>*/}
                          {/*);*/}
                      {/*})}*/}
                  </Switch>
              </ConnectedRouter>
          )
      }),
      document.getElementById('root')
    );

});
