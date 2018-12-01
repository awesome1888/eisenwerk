import React from 'react';
import { Route as RouteComponent, Redirect } from 'react-router-dom';
import redirector from '../../lib/redirector';

const Route = props => {
    console.dir('route props');
    console.dir(props);

    const whereTo = redirector(props);
    if (whereTo) {
        return <Redirect to={whereTo} />;
    }

    return <RouteComponent {...props} />;
};

export default Route;
