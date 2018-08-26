import React from 'react';
import BaseComponent from '../../../lib/ui/component/index.jsx';

export default class LayoutPageTwoColumn extends BaseComponent {

    hasTop() {
        return _.isExist(this.props.top);
    }

    render() {
        return (
            <div className="grid-container">
                {
                    this.hasTop()
                    &&
                    <div className="">
                        {this.props.top}
                    </div>
                }
                <div className="grid-x grid-margin-x">
                    <div className="cell small-12 medium-8">
                        {this.props.central || null}
                    </div>
                    <div className="cell small-12 medium-4">
                        {this.props.side || null}
                    </div>
                </div>
            </div>
        );
    }
}
