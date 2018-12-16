import passport from 'passport';
import { OAuth2Strategy } from 'passport-google-oauth';

export default class FrontServer {
    constructor(params = {}) {
        this._params = params;
    }

    prepare() {
        const { settings, network } = this.getParams();
        passport.use(
            new OAuth2Strategy(
                {
                    clientID: settings.get('auth.oauth2.google.client-id'),
                    clientSecret: settings.get('auth.oauth2.google.secret'),
                    callbackURL: `${settings.get(
                        'url.root',
                        '',
                    )}/auth/google/callback`,
                },
                (accessToken, refreshToken, profile, done) => {
                    console.dir('resolving user');
                    console.dir(accessToken);
                    console.dir(refreshToken);
                    console.dir(profile);
                    done(new Error('shit'), null);

                    // User.findOrCreate({ googleId: profile.id }, function (err, user) {
                    //     return done(err, user);
                    // });
                },
            ),
        );

        network.all('/success', (req, res) => {
            res.send('SUCCESS!');
        });

        network.all('/failure', (req, res) => {
            res.send('FAILURE!');
        });

        network.get(
            '/auth/google',
            passport.authenticate('google', {
                scope: ['https://www.googleapis.com/auth/plus.login'],
            }),
        );

        network.get(
            '/auth/google/callback',
            passport.authenticate('google', { failureRedirect: '/failure' }),
            (req, res) => {
                res.redirect('/success');
            },
        );
    }

    getParams() {
        return this._params || {};
    }
}
