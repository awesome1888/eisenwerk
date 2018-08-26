import React from 'react';
import BasePage from '../../../lib.ui/page/index.jsx';
import Authentication from '../../component/authentication/authentication.jsx';
import { Link } from 'react-router-dom';

class NotFoundPage extends BasePage {
    render() {
        return (
            <Authentication optionBar={!this.props.user && {register: true, login: true, employers: true}}>
                Go home, you are druk.
            </Authentication>
        );
    }
}

export default NotFoundPage.connect({
    store: store => store.global,
});
