import React from 'react';
import BaseComponent from '../../../lib/ui/component/index.jsx';
import Authentication from './../authentication/authentication.jsx';
import { withRouter } from 'react-router';

class UserLogout extends BaseComponent {

    componentDidMount() {
        this.logout();
    }

    logout() {
        this.getApplication().getAuthorization().signOut().then(() => {
            this.redirectTo('/login');
        });
    }

    render() {
        return (
            <Authentication>
                You are being logged out...
            </Authentication>
        );
    }
}

export default UserLogout.connect({
    router: true,
    context: true,
});
