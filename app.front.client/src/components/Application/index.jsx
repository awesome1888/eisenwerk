import '../../style/index.scss'; // main style goes before any other

import React from 'react';
import { connect } from 'react-redux';
import connectApplication from '../../context/application';

import * as reducer from './reducer';
import SorryScreen from '../SorryScreen';

import './style.scss';

class Application extends React.Component {
    componentDidMount() {
        this.props.dispatch({
            type: reducer.ENTER,
            payload: this.props.application,
        });
    }

    componentDidCatch(e) {
        this.dispatch({ type: reducer.FAILURE, payload: e });
    }

    render() {
        const { ready, error, routes } = this.props;

        if (!ready) {
            return null;
        }
        if (ready && error && SorryScreen) {
            return <SorryScreen error={error} />;
        }

        return <div className="application">{routes(this.props)}</div>;
    }
}

export default connect(state => state.application)(
    connectApplication(Application),
);
