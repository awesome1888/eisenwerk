import React from 'react';
import BaseLayout from '../../../lib/ui/layout/index.jsx';

// import classnames from 'classnames';

import Header from '../header/header.jsx';

export default class LayoutApplicationMain extends BaseLayout {
    render() {
        return (
            <div className="layout">
                <Header />
                {this.props.children}
            </div>
        );
    }
}
