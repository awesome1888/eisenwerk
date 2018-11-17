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
                          // render={() => {
                          //     return (
                          //         <LayoutOuter>
                          //             HOME
                          //             <Link to="/list">List</Link>
                          //         </LayoutOuter>
                          //     );
                          // }}
                          render={routes[0].render}
                          // key={1}
                      />
                      <Route
                          path="/list"
                          // render={() => {
                          //     return (
                          //         <LayoutOuter>
                          //             LIST
                          //             <Link to="/">Home</Link>
                          //         </LayoutOuter>
                          //     );
                          // }}
                          render={routes[1].render}
                          // key={2}
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
