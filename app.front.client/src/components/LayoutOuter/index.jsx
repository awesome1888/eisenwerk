import React from 'react';
import './style.scss';

const LayoutOuter = props => (
    <div className="layout-outer">
        <div className="layout-outer__container">
            {props.children}
        </div>
    </div>
);

export default LayoutOuter;
