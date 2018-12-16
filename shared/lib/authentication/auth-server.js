import passport from 'passport';
import OAuth2Strategy from 'passport-google-oauth20';
import { wrapError } from '../util';

export default class AuthServer {
    constructor(params = {}) {
        this._params = params;
    }

    attach() {
        const { settings, network, userEntity } = this.getParams();

        network.post(
            '/oauth2',
            wrapError(async (req, res) => {
                const { token, provider } = req.body;

                if (
                    !_.isStringNotEmpty(token) ||
                    !_.isStringNotEmpty(provider)
                ) {
                    throw new Error(400);
                }

                if (provider !== 'google') {
                    throw new Error(400);
                }

                console.dir('token');
                console.dir(token);

                // verify our token
                const strategy = new OAuth2Strategy(
                    {
                        authorizationURL: 'mock',
                        clientID: 'mock',
                        tokenURL: 'mock',
                    },
                    () => {},
                );

                let user = null;
                try {
                    user = await new Promise((resolve, reject) => {
                        strategy.userProfile(token, (err, data) => {
                            if (err) {
                                reject(err);
                            } else {
                                resolve(data);
                            }
                        });
                    });
                } catch (e) {}

                if (!user) {
                    return res.status(400).send('woops');
                }

                // find or create user, get their id
                const userId = await this.findOrCreateUser(provider, user);

                // create jwt

                // send jwt

                res.send('qqq');
            }),
        );

        network.post('/local', (req, res) => {});
    }

    async findOrCreateUser(provider, data) {
        const { userEntity } = this.getParams();

        const user = await userEntity.find({
            filter: {
                [`service.${provider}.id`]: data.id,
            },
            select: ['_id'],
        });
        if (!user) {
            const uData = this.adaptData(data);
            console.dir('udata:');
            console.dir(uData);
            // userEntity.save();
        }

        return '1';
    }

    adaptData(data) {
        const uData = {};

        let userEmail = null;
        const emails = data.emails;
        if (_.isArrayNotEmpty(emails)) {
            userEmail = emails.find(email => email.type === 'account').value;
        }
        if (userEmail) {
            _.set(uData, this.getLoginField(), userEmail);
        }

        uData.service = {};
        uData.service.google = {
            id: data.id,
        };

        if (data.name) {
            uData.profile = uData.profile || {};
            uData.profile.firstName = data.profile.givenName || '';
            uData.profile.lastName = data.profile.familyName || '';
        }

        return uData;
    }

    getParams() {
        return this._params || {};
    }

    getPasswordField() {
        return 'profile.password';
    }

    getLoginField() {
        return 'profile.email';
    }
}

// const googleRes = await axios.get('https://www.googleapis.com/oauth2/v1/tokeninfo', {
//     params: {
//         access_token: token,
//     },
// });

// const googleRes = await axios.get('https://www.googleapis.com/plus/v1/people/me', {
//     params: {
//         access_token: token,
//     },
// });
// user = googleRes.data;
