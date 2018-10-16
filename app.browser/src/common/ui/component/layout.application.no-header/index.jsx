import React from 'react';
import BaseLayout from '../../../lib/ui/layout/index.jsx';

export default class LayoutApplicationNoHeader extends BaseLayout {
    render() {
        return (
            <div className="layout">
                {this.props.children}
            </div>
        );
    }
}
