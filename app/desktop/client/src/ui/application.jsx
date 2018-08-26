import React from 'react';
import { Switch } from 'react-router-dom';
import '../common/style/index.less'; // main website styles here

import BaseApplication, { Route } from '../common/lib/ui/application/index.jsx';

import HomePage from './page/home/home.jsx';
import AccountPage from './page/account/account.jsx';
import NotFoundPage from '../common/ui/page/not-found/not-found.jsx';
import AccessDeniedPage from '../common/ui/page/access-denied/access-denied.jsx';
import LoginPage from './page/login/login.jsx';
import Logout from './../common/ui/component/logout/logout.jsx';
import PasswordForgot from './page/password-forgot/password-forgot.jsx';
import PasswordReset from './page/password-reset/password-reset.jsx';
import signupStepEnum from './component/signup/enum/signup-step.enum.js';

import ApplicationLayout from './../common/ui/component/layout.application.main/index.jsx';
import ApplicationLayoutNoHeader from './../common/ui/component/layout.application.no-header/index.jsx';

import roleEnum from '../common/lib/enum/role.js';

export default class Application extends BaseApplication {
    getRoutes() {
        const app = this.getApplication();
        const access = {
            authorized: true,
        };

        return (
            <Switch>
                <Route
                    exact
                    path="/"
                    redirect={{
                        '/': () => app.hasUser(),
                        '/login': () => !app.hasUser(),
                    }}
                    render={() => (
                        <ApplicationLayout>
                            <HomePage />
                        </ApplicationLayout>
                    )}
                    access={access}
                />
                <Route
                    path="/logout"
                    redirectNotAuthorized="/login"
                    render={() => (
                        <Logout />
                    )}
                />
                <Route
                    path="/login"
                    redirect={() => {
                        if (app.hasUser()) {
                            return '/';
                        }

                        return false;
                    }}
                    render={props => (
                        <ApplicationLayoutNoHeader>
                            <LoginPage {...props} />
                        </ApplicationLayoutNoHeader>
                    )}
                />
                <Route
                    path="/forgot-password"
                    redirectAuthorized="/"
                    render={props => (
                        <ApplicationLayoutNoHeader>
                            <PasswordForgot {...props} />
                        </ApplicationLayoutNoHeader>
                    )}
                />
                <Route
                    path="/reset-password/:token"
                    redirectAuthorized="/"
                    render={props => (
                        <ApplicationLayoutNoHeader>
                            <PasswordReset {...props} />
                        </ApplicationLayoutNoHeader>
                    )}
                />
                <Route
                    path="/account"
                    redirectNotAuthorized="/login"
                    render={props => (
                        <ApplicationLayout>
                            <AccountPage {...props} />
                        </ApplicationLayout>
                    )}
                    access={access}
                />
                <Route
                    path="/403"
                    render={() => (
                        <ApplicationLayoutNoHeader>
                            <AccessDeniedPage />
                        </ApplicationLayoutNoHeader>
                    )}
                />
                <Route
                    render={() => (
                        <ApplicationLayoutNoHeader>
                            <NotFoundPage />
                        </ApplicationLayoutNoHeader>
                    )}
                />
            </Switch>
        );
    }
}
