import React from 'react';
import { Switch } from 'react-router';
import { ConnectedRouter } from 'connected-react-router';
import { connect } from 'react-redux';

import * as reducer from './reducer.js';
import history from '../../lib/history';
import Auth from '../../api/auth';
import Route from '../Route';

// pages
import LoginPage from '../../pages/Login';
import JobListPage from '../../pages/JobList';
import JobDetailPage from '../../pages/JobDetail';

import './style.scss';

class Application extends React.Component {

    componentDidMount() {
        const isFresh = Auth.isTokenFresh();
        this.props.dispatch({type: isFresh ? reducer.APPLICATION_AUTHORIZED_SET : reducer.APPLICATION_AUTHORIZED_UNSET});
        this.props.dispatch({type: reducer.APPLICATION_READY_SET});
    }

    render() {
        if (!this.props.ready) {
            // todo: show me some fancy loader?
            return null;
        }

        return (
          <div className="application">
              <ConnectedRouter history={history}>
                  <Switch>
                      <Route
                        path="/login"
                        redirectAuthorized="/"
                        render={() => (
                          <LoginPage />
                        )}
                        {...this.props}
                      />
                      <Route
                        exact
                        path="/job/:id"
                        redirectNotAuthorized="/login"
                        render={(route) => {
                            return (
                              <JobDetailPage match={route.match}/>
                            );
                        }}
                        {...this.props}
                      />
                      <Route
                        exact
                        path="/"
                        redirectNotAuthorized="/login"
                        render={() => (
                          <JobListPage
                            title="Jobs Entdecken"
                          />
                        )}
                        {...this.props}
                      />
                  </Switch>
              </ConnectedRouter>
          </div>
        );
    }
}

export default connect(state => state.application)(Application);
