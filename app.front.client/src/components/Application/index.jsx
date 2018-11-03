import '../../style/index.scss'; // main style goes before any other

import React from 'react';
import { Switch } from 'react-router';
import { ConnectedRouter } from 'connected-react-router';
import { connect } from 'react-redux';

import * as reducer from './reducer.js';
import history from '../../lib/history';
// import Auth from '../../api/auth';
import Route from '../Route';

// pages
import HomePage from '../../pages/Home';

import './style.scss';

class Application extends React.Component {

    componentDidMount() {
        if (this.props.useAuth) {
            // check if we are authorized
            // todo
            this.props.dispatch({type: reducer.APPLICATION_READY_SET});
        } else {
            this.props.dispatch({type: reducer.APPLICATION_READY_SET});
        }
        // const isFresh = Auth.isTokenFresh();
        // this.props.dispatch({type: isFresh ? reducer.APPLICATION_AUTHORIZED_SET : reducer.APPLICATION_AUTHORIZED_UNSET});
    }

    render() {
        if (false && !this.props.ready) {
            // todo: show me some fancy loader?
            return null;
        }

        return (
            <div className="application">
                <ConnectedRouter history={history}>
                    <Switch>
                        <Route
                            exact
                            path="/"
                            // redirectNotAuthorized="/login"
                            render={(route) => {
                                console.dir('match!');
                                return (
                                    <HomePage match={route.match} />
                                );
                            }}
                            {...this.props}
                        />
                    </Switch>
                </ConnectedRouter>
            </div>
        );
    }
}

export default connect(state => state.application)(Application);
