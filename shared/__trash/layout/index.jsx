import React from 'react';
import BaseComponent from '../component/index.jsx';

export default class Layout extends BaseComponent {
    componentDidMount() {
        if (_.isObjectNotEmpty(window.__overlay)) {
            window.__overlay.hide();
        }
        super.componentDidMount();
    }

    componentWillUnmount() {
        if (_.isObjectNotEmpty(window.__overlay)) {
            window.__overlay.show();
        }
        super.componentWillUnmount();
    }
}
