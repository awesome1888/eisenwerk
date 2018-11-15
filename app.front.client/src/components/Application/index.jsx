import '../../style/index.scss'; // main style goes before any other

import React from 'react';
import { connect } from 'react-redux';

import * as reducer from './reducer.js';
// // import Auth from '../../api/auth';

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
        const { children } = this.props;

        return (
            <div className="application">
                {children}
            </div>
        );
    }
}

export default connect(state => state.application)(Application);
