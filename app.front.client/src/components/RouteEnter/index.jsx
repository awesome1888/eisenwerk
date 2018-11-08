import React from 'react';

export default class RouteEnter extends React.Component {
    componentDidUpdate() {
        // todo: use reselect here?
        // console.dir('route changed');
    }

    render() {
        return this.props.children;
    }
}
