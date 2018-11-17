import React from 'react';
import LayoutOuterBase from '../LayoutOuterBase';
import './style.scss';

export default class LayoutOuter extends LayoutOuterBase {

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
                        234434232
                    </div>
                </div>
                <div className="layout-inner__container">
                    {this.props.children}
                </div>
            </div>
        );
    }
};
