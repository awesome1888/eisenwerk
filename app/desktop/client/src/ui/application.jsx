import React from 'react';
import { Switch } from 'react-router-dom';
import '../common/style/index.less'; // main website styles here

import BaseApplication, { Route } from '../common/lib/ui/application/index.jsx';

import HomePage from './page/home/home.jsx';
import ActionsPage from './page/actions/actions.jsx';
import AccountPage from './page/account/account.jsx';
import CandidateProfilePage from './page/candidate/candidate.jsx';
import NotFoundPage from '../common/ui/page/not-found/not-found.jsx';
import AccessDeniedPage from '../common/ui/page/access-denied/access-denied.jsx';
import LoginPage from './page/login/login.jsx';
import Logout from './../common/ui/component/logout/logout.jsx';
import Signup from './page/signup/signup.jsx';
import PasswordForgot from './page/password-forgot/password-forgot.jsx';
import PasswordReset from './page/password-reset/password-reset.jsx';
import signupStepEnum from './component/signup/enum/signup-step.enum.js';

import ApplicationLayout from './../common/ui/component/layout.application.main/index.jsx';
import ApplicationLayoutNoHeader from './../common/ui/component/layout.application.no-header/index.jsx';

import roleEnum from '../common/lib/enum/role.js';

export default class Application extends BaseApplication {

    getSignupStep() {
        const app = this.getApplication();

        if (app.hasUser()) {
            const step = app.getUser().getSignupStep();
            return signupStepEnum.getValueByIndex(step);
        }
        return '/';
    }

    getRoutes() {
        const app = this.getApplication();

        return (
            <Switch>
                <Route
                    exact
                    path="/"
                    redirect={{
                        '/profile/view/all': () => app.hasUser() && app.getUser().hasRole(roleEnum.CANDIDATE),
                        '/login': () => !app.hasUser(),
                    }}
                    render={() => (
                        <ApplicationLayout>
                            <HomePage />
                        </ApplicationLayout>
                    )}
                    access={{
                        authorized: true,
                        roleAny: [roleEnum.EMPLOYER, roleEnum.CANDIDATE],
                    }}
                />
                <Route
                    path="/signup/:step"
                    redirect={{
                        '/': () => app.hasUser() && !app.getUser().hasRole(roleEnum.PRE_CANDIDATE),
                    }}
                    render={props => (
                        <ApplicationLayoutNoHeader>
                            <Signup {...props} />
                        </ApplicationLayoutNoHeader>
                    )}
                />
                <Route
                    path="/signup"
                    redirect={() => {
                        if (app.hasUser()) {
                            if (!app.getUser().hasRole(roleEnum.PRE_CANDIDATE)) {
                                return '/';
                            } else {
                                return this.getSignupStep();
                            }
                        }

                        return false;
                    }}
                    render={props => (
                        <ApplicationLayoutNoHeader>
                            <Signup {...props} />
                        </ApplicationLayoutNoHeader>
                    )}
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
                            if (app.getUser().hasRole(roleEnum.EMPLOYER)) {
                                return '/';
                            } else if (!app.getUser().hasRole(roleEnum.PRE_CANDIDATE)) {
                                return '/profile/view/all';
                            } else {
                                return this.getSignupStep();
                            }
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
                    path="/profile/:section/:item"
                    redirectNotAuthorized="/login"
                    render={props => (
                        <ApplicationLayout>
                            <CandidateProfilePage {...props} />
                        </ApplicationLayout>
                    )}
                    access={{
                        authorized: true,
                        roleAny: [roleEnum.CANDIDATE],
                    }}
                />
                <Route
                    path="/account"
                    redirectNotAuthorized="/login"
                    render={props => (
                        <ApplicationLayout>
                            <AccountPage {...props} />
                        </ApplicationLayout>
                    )}
                    access={{
                        authorized: true,
                        roleAny: [roleEnum.EMPLOYER, roleEnum.CANDIDATE],
                    }}
                />
                <Route
                    path="/actions"
                    render={props => (
                        <ApplicationLayout>
                            <ActionsPage {...props} />
                        </ApplicationLayout>
                    )}
                    access={{
                        authorized: false,
                    }}
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
