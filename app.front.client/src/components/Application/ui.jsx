import '../../style/index.scss'; // main style goes before any other

import React from 'react';
// import { Switch } from 'react-router';
// import { ConnectedRouter } from 'connected-react-router';
import { connect } from 'react-redux';

import * as reducer from './reducer.js';
// import history from '../../lib/history';
// // import Auth from '../../api/auth';
// import Route from '../Route';
// import RouteEnter from '../RouteEnter';
// import DynamicImport from '../DynamicImport';
// import LayoutOuter from '../LayoutOuter';

import ListPage from '../../pages/List/ui';

import './style.scss';

class Application extends React.Component {

    componentDidMount() {
        this.props.dispatch({type: reducer.APPLICATION_START});
        // if (this.props.useAuth) {
        //     // check if we are authorized
        //     // todo
        //     this.props.dispatch({type: reducer.APPLICATION_READY_SET});
        // } else {
        //
        // }
        // // const isFresh = Auth.isTokenFresh();
        // // this.props.dispatch({type: isFresh ? reducer.APPLICATION_AUTHORIZED_SET : reducer.APPLICATION_AUTHORIZED_UNSET});
    }

    render() {
        const { ready } = this.props;

        return (
            <React.Fragment>
                <div className="application">
                    {
                        ready
                        &&
                        <div>I am ready to be free!!!</div>
                    }
                    <ListPage />
                </div>
            </React.Fragment>
        );
        // return (
        //     <div className="application">
        //         <ConnectedRouter history={history}>
        //             <Switch>
        //                 <Route
        //                     exact
        //                     path="/"
        //                     // redirectNotAuthorized="/login"
        //                     render={(route) => {
        //                         return (
        //                             <RouteEnter route={route}>
        //                                 <LayoutOuter>
        //                                     <HomePage match={route.match} />
        //                                 </LayoutOuter>
        //                             </RouteEnter>
        //                         );
        //                     }}
        //                     {...this.props}
        //                 />
        //                 <Route
        //                     path="/list"
        //                     render={(route) => {
        //                         return (
        //                             <RouteEnter route={route}>
        //                                 <LayoutOuter>
        //                                     <DynamicImport load={() => import('../../pages/List')}>
        //                                         {Component => Component && <Component match={route.match} />}
        //                                     </DynamicImport>
        //                                 </LayoutOuter>
        //                             </RouteEnter>
        //                         );
        //                     }}
        //                     {...this.props}
        //                 />
        //             </Switch>
        //         </ConnectedRouter>
        //     </div>
        // );
    }
}

export default connect(state => state.application)(Application);
