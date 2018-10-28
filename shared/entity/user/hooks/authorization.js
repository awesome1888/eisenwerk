import local from '@feathersjs/authentication-local';
import commonHooks from 'feathers-hooks-common';
import roleEnum from '../enum/role.js';
import hash from '../../../vendor/feathersjs/hasher.js';
import Context from '../../../lib/context';

export default class AuthorizationHook {
    static async isAdmin(auth) {
        return async (context) => {
            await Context.extractUser(context, auth)
                .then((user) => {
                    return user.hasRole(roleEnum.ADMINISTRATOR);
                })
                .catch(() => {});
            return false;
        };
    }

    static async declare(hooks, application) {
        const auth = application.getAuthorization();
        hooks.declare({
            before: {
                create: [
                    // on create we hash the given password
                    commonHooks.iff(
                        commonHooks.isProvider('external'),
                        local.hooks.hashPassword({
                            passwordField: auth.getPasswordField(),
                            hash,
                        })
                    )
                ],
                update: [
                    // on update we also hash the given password
                    commonHooks.iff(
                        commonHooks.isProvider('external'),
                        local.hooks.hashPassword({
                            passwordField: auth.getPasswordField(),
                            hash,
                        })
                    )
                ],
                patch: [
                    commonHooks.iff(
                        commonHooks.isProvider('external'),
                        commonHooks.iffElse(
                            this.isAdmin(auth),
                            commonHooks.preventChanges(
                                'isVerified',
                                'verifyToken',
                                'verifyShortToken',
                                'verifyExpires',
                                'verifyChanges',
                                'resetToken',
                                'resetShortToken',
                                'resetExpires'
                            ),
                            commonHooks.preventChanges(
                                'password',
                                auth.getUserNameField(),
                                auth.getPasswordField(),
                                'isVerified',
                                'verifyToken',
                                'verifyShortToken',
                                'verifyExpires',
                                'verifyChanges',
                                'resetToken',
                                'resetShortToken',
                                'resetExpires'
                            )
                        )
                    ),
                    (context) => {
                        if (!_.isUndefined(context.data.password) && _.isStringNotEmpty(context.data.password)) {
                            context.data['profile.password'] = context.data.password;
                            delete context.data.password;
                        }
                    },
                    // on patch we also hash the given password
                    commonHooks.iff(
                        commonHooks.isProvider('external'),
                        local.hooks.hashPassword({
                            passwordField: auth.getPasswordField(),
                            hash,
                        })
                    ),
                ]
            },
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
                find: [
                    (context) => {
                        if (
                            !_.isUndefined(context.result) &&
                            !_.isUndefined(context.result.data) &&
                            _.isArrayNotEmpty(context.result.data)
                        ) {
                            const data = context.result.data;
                            for (let i = 0; i < data.length; i++) {
                                if (!_.isUndefined(data[i].profile) && _.isStringNotEmpty(data[i].profile.password)) {
                                    data[i].password = data[i].profile.password;
                                }
                            }
                        }
                    }
                ],
            },
        });
    }

    static declarePreProcess(hooks) {
        hooks.declare({
            before: {
                all: [
                    (ctx) => {
                        if (ctx.method !== 'create') {
                            return ctx;
                        }

                        // when the user gets created through google oauth2, we need to extract
                        // their data and put on the right place
                        const google = _.getValue(ctx, 'data.google');
                        if (_.isObjectNotEmpty(google)) {
                            let userEmail = null;
                            const emails = _.getValue(google, 'profile.emails');
                            if (_.isArrayNotEmpty(emails)) {
                                userEmail = emails.find(email => email.type === 'account').value;
                            }

                            delete ctx.data.google;

                            const gProfile = google.profile;

                            delete gProfile._raw;
                            delete gProfile._json;

                            // set google service
                            const sProfile = _.deepClone(gProfile);
                            delete sProfile.id;
                            delete sProfile.name;
                            delete sProfile.displayName;

                            ctx.data.service = ctx.data.service || {};
                            ctx.data.service.google = {
                                id: gProfile.id,
                                profile: sProfile,
                            };

                            ctx.data.profile = ctx.data.profile || {};

                            // set email
                            ctx.data.profile.email = userEmail;

                            // set names
                            const names = _.getValue(google, 'profile.name');
                            if (_.isObjectNotEmpty(names)) {
                                ctx.data.profile.firstName = names.givenName || '';
                                ctx.data.profile.lastName = names.familyName || '';
                            }

                            // set role
                            if (this.isLegalGoogleEmail(userEmail)) {
                                ctx.data.role = [roleEnum.ADMINISTRATOR];
                            }
                        }

                        return ctx;
                    },
                ],
            }
        });
    }

    static isLegalGoogleEmail(email) {
        return email.slice(email.lastIndexOf('@') + 1) === 'some-domain.com';
    }
}
