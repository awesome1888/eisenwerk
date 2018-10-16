import React from 'react';
import BasePage from '../../../lib.ui/page/index.jsx';
import { Link } from 'react-router-dom';

class NotFoundPage extends BasePage {
    render() {
        return (
            <Authentication optionBar={!this.props.user && {register: true, login: true}}>
                No way you`ll get this.
            </Authentication>
        );
    }
}

export default NotFoundPage.connect({
    store: store => store.global,
});
