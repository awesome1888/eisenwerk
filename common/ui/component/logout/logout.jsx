import React from 'react';
import BaseComponent from '../../../lib.ui/component/index.jsx';
import Authentication from './../authentication/authentication.jsx';

class UserLogout extends BaseComponent {

    componentDidMount() {
        this.logout();
    }

    logout() {
        this.getApplication().getAuthorization().signOut().then(() => {
            this.getRouter().go('/login');
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
