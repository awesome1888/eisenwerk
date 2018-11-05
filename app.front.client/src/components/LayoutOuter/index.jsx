import React from 'react';
import LayoutOuterBase from '../LayoutOuterBase';
import './style.scss';

export default class LayoutOuter extends LayoutOuterBase {
    render() {
        return (
            <div className="layout-outer">
                <div className="layout-outer__container">
                    {this.props.children}
                </div>
            </div>
        );
    }
};
