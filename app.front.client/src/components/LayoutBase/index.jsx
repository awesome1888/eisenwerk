import React from 'react';

/**
 * I have made an exception for the rule "never inherit react components" here, because in this particular case it
 * makes sense and saves the day.
 * If we switch between routes with the layout of the same class, the layout will not get mounted/unmounted, therefore
 * no overlay will be displayed. But when we switch the route from one type of layout to another, componentWillUnmount()
 * and componentDidMount() will be called, so as our overlay.show() and overlay.hide()
 */
export default class LayoutBase extends React.Component {
    componentDidMount() {
        if (window.__overlay) {
            window.__overlay.hide();
        }
    }

    componentWillUnmount() {
        if (window.__overlay) {
            window.__overlay.show();
        }
    }
}
