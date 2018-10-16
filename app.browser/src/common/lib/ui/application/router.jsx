import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import BaseComponent from '../component/index.jsx';

class Router extends BaseComponent {
    render() {
        if (!this.props.ready) {
            return null;
        }

        return (
            <BrowserRouter {...this.props} />
        );
    }
}

export default Router.connect({
    store: store => store.global,
});
