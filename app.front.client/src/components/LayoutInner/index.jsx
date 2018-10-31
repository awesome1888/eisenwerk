import React from 'react';
import './style.scss';

// import Menu from '../../components/Menu';

const LayoutInner = props => (
    <div className="layout-inner">
        <div className="layout-inner__top">
            <div className="layout-inner__top-container">
                {/*<Menu {...props} />*/}
            </div>
        </div>
        <div className="layout-inner__container">
            {props.children}
        </div>
    </div>
);

export default LayoutInner;
