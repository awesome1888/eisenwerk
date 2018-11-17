import React from 'react';
import './style.scss';
import LayoutBase from '../../components/LayoutBase';

// import Menu from '../../components/Menu';

export default class LayoutInner extends LayoutBase {

    componentWillUnmount() {
        console.dir('unmount inner');
    }

    render() {
        return (
            <div className="layout-inner">
                {this.props.children}
            </div>
        );
    }
}

//
//
// const LayoutInner = props => (
//     <div className="layout-inner">
//         <div className="layout-inner__top">
//             <div className="layout-inner__top-container">
//                 {/*<Menu {...props} />*/}
//             </div>
//         </div>
//         <div className="layout-inner__container">
//             {props.children}
//         </div>
//     </div>
// );
//
// export default LayoutInner;
