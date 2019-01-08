/**
 * This class is used on the client serving server to enable integration with OAuth2.
 *
 */

import passport from 'passport';
import { OAuth2Strategy } from 'passport-google-oauth';
import axios from 'axios';
import makeTokenScript from './util/make-token-script';

export default class WebServerAuthentication {
    constructor(params = {}) {
        this._params = params;
    }

    attach() {
        const { settings, network } = this.getParams();
        passport.use(
            new OAuth2Strategy(
                {
                    clientID: settings.get('auth.google.client-id'),
                    clientSecret: settings.get('auth.google.secret'),
                    callbackURL: `${settings.get(
                        'url.root',
                        '/',
                    )}auth/google/callback`,
                },
                (accessToken, refreshToken, profile, done) => {
                    // console.dir('resolving user');
                    // console.dir(accessToken);
                    // console.dir(profile);

                    const authURL = settings.get('url.auth.inner');
                    if (!_.isStringNotEmpty(authURL)) {
                        throw new Error('No url.auth parameter specified');
                    }

                    // ask our auth service to create/update a user and issue a token
                    axios
                        .post(`${authURL}oauth2`, {
                            provider: 'google',
                            token: accessToken,
                        })
                        .then(res => {
                            // console.dir('res::::');
                            // console.dir(res);
                            done(null, res);
                        })
                        .catch(err => {
                            // console.dir(err);
                            done(err);
                        });
                },
            ),
        );

        // use also local strategy here

        passport.serializeUser((user, cb) => {
            cb(null, user);
        });

        passport.deserializeUser((obj, cb) => {
            cb(null, obj);
        });

        network.use(passport.initialize());
        network.use(passport.session());

        network.get('/failure', (req, res) => {
            res.send('FAILURE!');
        });

        network.get(
            '/auth/google',
            passport.authenticate('google', {
                scope: ['email', 'profile'],
            }),
        );

        network.get(
            '/auth/google/callback',
            passport.authenticate('google', {
                failureRedirect: '/failure',
            }),
            (req, res) => {
                const token = _.get(req, 'session.passport.user.data.token');
                if (!_.isStringNotEmpty(token)) {
                    return res.redirect('/failure');
                }

                return makeTokenScript(res, token);
            },
        );
    }

    getParams() {
        return this._params || {};
    }
}
