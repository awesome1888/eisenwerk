import auth from '@feathersjs/authentication';
import authManagement from '../../../vendor/feathersjs/authentication-management';
import local from '@feathersjs/authentication-local';
import jwt from '@feathersjs/authentication-jwt';
import commonHooks from 'feathers-hooks-common';
import oauth2 from '../../../vendor/feathersjs/authentication-oauth2/lib';
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
            // entity: 'user',
            // service: 'user',
        }));
        app.configure(jwt());
        app.configure(oauth2({
            idField: 'service.google.id',
            name: 'google',
            Strategy: GoogleStrategy,
            clientID: settings.getOAuthGoogleClientId() || 'no-id',
            clientSecret: settings.getOAuthGoogleSecret() || 'no-secret',
            attachTokenToSuccessURL: true,
            // successRedirect: '/auth/success?token=___TOKEN___',
            successRedirect: `${settings.getClientURL()}/auth/success?token=___TOKEN___`,
            scope: [
                'profile openid email',
            ],
            // entity: 'user',
            // service: 'user',
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

    /**
     * Get user by their token
     * @param token
     * @returns {Promise<*>}
     */
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
}
