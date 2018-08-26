import React from 'react';
import BaseComponent from '../component/index.jsx';

export default class Page extends BaseComponent {

    componentWillUnmount() {
        if (this.getReducer()) {
            this.dispatch('cleanup');
        }
    }

    /**
     * Returns on-page reducer, if declared.
     * @returns {null}
     */
    getReducer() {
        return null;
    }

    getActionScope() {
        const reducer = this.getReducer();
        if (reducer) {
            return reducer.getActionScope();
        }

        return super.getActionScope();
    }
}
