import auth from '@feathersjs/authentication';
import errors from '@feathersjs/errors';
import authManagement from '../../../../vendor/feathersjs/authentication-management/lib/index';
import local from '@feathersjs/authentication-local';
import jwt from '@feathersjs/authentication-jwt';
import commonHooks from 'feathers-hooks-common';
import oauth2 from '../../../../vendor/feathersjs/authentication-oauth2/lib/index';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

import AuthorizationBoth from './both';
import Oauth2Failure from './oauth2-failure';

export default class Authorization extends AuthorizationBoth {
    static prepare(app, settings, userEntity) {
        app.configure(
            auth({
                secret: settings.getSecret(),
            }),
        );

        const entity = {
            entity: userEntity.getUId(),
            service: userEntity.getUId(),
        };

        // support of local
        if (settings.useAuthLocal()) {
            app.configure(
                local({
                    usernameField: this.getLoginField(),
                    passwordField: this.getPasswordField(),
                    ...entity,
                }),
            );
        }

        app.configure(jwt(entity));

        // support of google
        if (settings.useOAuthGoogle()) {
            app.configure(
                oauth2({
                    idField: 'service.google.id',
                    name: 'google',
                    Strategy: GoogleStrategy,
                    clientID: settings.getOAuthGoogleClientId() || 'no-id',
                    clientSecret:
                        settings.getOAuthGoogleSecret() || 'no-secret',
                    attachTokenToSuccessURL: true,
                    // successRedirect: '/auth/success?token=___TOKEN___',
                    // todo: this is terrible
                    successRedirect: `${settings.getClientURL()}/auth/success?token=___TOKEN___`,
                    scope: ['profile openid email'],
                    ...entity,
                }),
            );
        }

        app.configure(
            authManagement({
                identifyUserProps: [this.getLoginField()],
            }),
        );

        // apply some security measures
        const authService = app.service('authentication');
        if (authService) {
            authService.hooks({
                before: {
                    create: [auth.hooks.authenticate(['local', 'jwt'])],
                    remove: [auth.hooks.authenticate('jwt')],
                },
            });
        }

        const authManagementService = app.service('authManagement');
        if (authManagementService) {
            authManagementService.hooks({
                after: {
                    all: [
                        // when called over the wire, we prevent some fields from exposing to the client
                        commonHooks.iff(commonHooks.isProvider('external'), [
                            local.hooks.protect(this.getPasswordField()),
                            local.hooks.protect('password'),
                            local.hooks.protect('service'),
                        ]),
                    ],
                },
            });
        }

        Oauth2Failure.attach(app);
    }

    /**
     * Get token payload, if it is valid.
     * todo: on server side we can simplify this with redis cache
     * The function makes the remote call.
     * @param token
     * @returns {Promise<*>}
     */
    async extractPayload(token) {
        token = await this.getToken(token);
        if (!token) {
            return null;
        }

        return this.getNetwork()
            .getApp()
            .passport.verifyJWT(token, {
                secret: this.getSettings().getSecret(),
            });
    }

    /**
     * Get user by their token
     * @param token
     * @returns {Promise<*>}
     */
    async getUser(token = null) {
        if (!this._userEntity) {
            return null;
        }

        const id = await this.getUserId(token);
        if (!id) {
            return null;
        }

        let u = null;
        try {
            u = await this._userEntity.get(id);
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
