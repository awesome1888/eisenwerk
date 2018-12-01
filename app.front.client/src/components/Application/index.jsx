import '../../style/index.scss'; // main style goes before any other

import React from 'react';
import { connect } from 'react-redux';

import * as reducer from './reducer';
import SorryScreen from '../SorryScreen';
// // import Auth from '../../api/auth';

import './style.scss';

class Application extends React.Component {
    componentDidMount() {
        this.props.dispatch({ type: reducer.ENTER });
        // if (this.props.useAuth) {
        //  const isFresh = Auth.isTokenFresh();
        //  this.props.dispatch({type: isFresh ? reducer.APPLICATION_AUTHORIZED_SET : reducer.APPLICATION_AUTHORIZED_UNSET});
        // }
    }

    componentDidCatch(e) {
        this.dispatch({ type: reducer.FAILURE, payload: e });
    }

    render() {
        if (this.props.ready && this.props.error && SorryScreen) {
            return <SorryScreen error={this.props.error} />;
        }

        return (
            <div className="application">{this.props.routes(this.props)}</div>
        );
    }
}

export default connect(state => state.application)(Application);
