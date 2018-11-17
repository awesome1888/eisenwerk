import React from 'react';
import LayoutBase from '../LayoutBase';
import './style.scss';

export default class LayoutOuter extends LayoutBase {

    componentDidMount() {
        console.dir('outer mounted!');
    }

    componentWillUnmount() {
        console.dir('unmount outer!');
    }

    render() {
        return (
            <div className="layout-inner">
                <div className="layout-inner__top">
                    <div className="layout-inner__top-container">
                        {/*<Menu {...props} />*/}
                        MENU
                    </div>
                </div>
                <div className="layout-inner__container">
                    {this.props.children}
                </div>
            </div>
        );
    }
};
