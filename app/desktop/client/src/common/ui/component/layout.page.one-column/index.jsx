import React from 'react';
import BaseComponent from '../../../lib/ui/component/index.jsx';

export default class LayoutPageOneColumn extends BaseComponent {

    hasTop() {
        return _.isExist(this.props.top);
    }

    render() {
        return (
            <div>
                {
                    this.hasTop()
                    &&
                    <div className="">
                        {this.props.top}
                    </div>
                }
                <div className="grid-container">
                    <div className="grid-x grid-margin-x">
                        <div className="cell small-12">
                            {this.props.central || this.props.children || null}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
