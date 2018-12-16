import passport from 'passport';
import { OAuth2Strategy } from 'passport-google-oauth';
import axios from 'axios';

/**
 * The only purpose of this class in to work with OAuth2 on the same host where we serve our frontend
 */
export default class FrontServer {
    constructor(params = {}) {
        this._params = params;
    }

    attach() {
        const { settings, network } = this.getParams();
        passport.use(
            new OAuth2Strategy(
                {
                    clientID: settings.get('auth.oauth2.google.client-id'),
                    clientSecret: settings.get('auth.oauth2.google.secret'),
                    callbackURL: `${settings.get(
                        'url.root',
                        '/',
                    )}auth/google/callback`,
                },
                (accessToken, refreshToken, profile, done) => {
                    console.dir('resolving user');
                    console.dir(accessToken);
                    console.dir(profile);

                    const authURL = settings.get('url.auth.inner');
                    if (!_.isStringNotEmpty(authURL)) {
                        throw new Error('No url.auth parameter specified');
                    }

                    axios
                        .post(`${authURL}oauth2`, {
                            provider: 'google',
                            token: accessToken,
                        })
                        .then(res => {
                            console.dir(res);
                            done(null, res);
                        })
                        .catch(err => {
                            console.dir(err);
                            done(err);
                        });
                },
            ),
        );

        network.all('/auth/result', (req, res) => {
            if (req.query.failure) {
                res.send('FUCK!');
            } else {
                res.send('SUCCESS!');
            }
        });

        network.get('/failure', (req, res) => {
            res.send('FAILURE!');
        });

        network.get(
            '/auth/google',
            passport.authenticate('google', {
                scope: [
                    // 'https://www.googleapis.com/auth/plus.login',
                    'email',
                    'profile',
                ],
            }),
        );

        network.get(
            '/auth/google/callback',
            passport.authenticate('google', {
                failureRedirect: '/auth/result?failure',
            }),
            (req, res) => {
                res.redirect('/success');
            },
        );
    }

    getParams() {
        return this._params || {};
    }
}
