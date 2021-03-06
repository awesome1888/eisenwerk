import auth from '@feathersjs/authentication';
import authManagement from '../../../vendor/feathers-authentication-management';
import local from '@feathersjs/authentication-local';
import jwt from '@feathersjs/authentication-jwt';
// import oauth2 from '@feathersjs/authentication-oauth2';
import commonHooks from 'feathers-hooks-common';
import oauth2 from '../../../vendor/feathersjs/authentication-oauth2';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

import AuthorizationBoth from './both.js';
import Oauth2Failure from './oauth2-failure.js';
import User from '../../../entity/user/entity/server.js';
import errors from '@feathersjs/errors';

export default class Authorization extends AuthorizationBoth {

    static prepare(app, settings) {
        app.configure(auth({
            secret: settings.getSecret(),
        }));
        app.configure(local({
            usernameField: this.getUserNameField(),
            passwordField: this.getPasswordField(),
        }));
        app.configure(jwt());
        app.configure(oauth2({
            idField: 'service.google.id',
            name: 'google',
            Strategy: GoogleStrategy,
            clientID: settings.getOAuthGoogleClientId(),
            clientSecret: settings.getOAuthGoogleSecret(),
            attachTokenToSuccessURL: true,
            // successRedirect: '/auth/success?token=___TOKEN___',
            successRedirect: `${settings.getClientURL()}/auth/success?token=___TOKEN___`,
            scope: [
                'profile openid email',
            ],
        }));
        app.configure(authManagement({
            identifyUserProps: ['profile.email'],
        }));

        // apply some security measures
        const authService = app.service('authentication');
        if (authService) {
            authService.hooks({
                before: {
                    create: [
                        auth.hooks.authenticate(['local', 'jwt']),
                    ],
                    remove: [
                        auth.hooks.authenticate('jwt')
                    ]
                }
            });
        }

        const authManagementService = app.service('authManagement');
        if (authManagementService) {
            authManagementService.hooks({
                after: {
                    all: [
                        // when called over the wire, we prevent some fields from exposing to the client
                        commonHooks.iff(
                            commonHooks.isProvider('external'),
                            [
                                local.hooks.protect('profile.password'),
                                local.hooks.protect('password'),
                                local.hooks.protect('service'),
                            ]
                        ),
                    ],
                }
            });
        }

        Oauth2Failure.attach(app);
    }

    getVerificationOptions() {
        // we have to provide the secret manually on the server side
        return {
            secret: this.getSettings().getSecret(),
        };
    }

    async getUser(token = null) {
        const id = await this.getUserId(token);
        if (!id) {
            return null;
        }

        let u = null;
        try {
            u = await User.get(id);
        } catch (e) {
            if (e instanceof errors.NotFound) {
                u = null;
            } else {
                throw e;
            }
        }

        return u;
    }

    extractToken(ctx) {
        return _.getValue(ctx, 'params.headers.authorization');
    }

    /**
     * Get user from the context
     * @param context
     * @returns {Promise<*>}
     */
    async getUserByContext(context) {
        if (_.isObjectNotEmpty(context.__user)) {
            return context.__user;
        }

        const token = this.extractToken(context);
        if (_.isStringNotEmpty(token)) {
            context.__user = await this.getUser(token);
            return context.__user;
        }

        return null;
    }
}
