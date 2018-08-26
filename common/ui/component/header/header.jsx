import React from 'react';
import BaseComponent from '../../../lib.ui/component/index.jsx';
import { Link } from 'react-router-dom';

import './style.less';

class NavBar extends BaseComponent {
    render() {
        const user = this.props.user;
        if (!_.isObjectNotEmpty(user)) {
            // not authorized
            return null;
        }

        return (
            <div>
                Guten morgen!
            </div>
        );
    }
}

export default NavBar.connect({
    router: true,
    store: store => store.global,
});
