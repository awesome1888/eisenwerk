/**
 * This class is used on the side of AUTH server
 */

// import passport from 'passport';
import jwt from 'jsonwebtoken';
import OAuth2Strategy from 'passport-google-oauth20';
import { wrapError } from '../util';

export default class AuthServer {
    constructor(params = {}) {
        this._params = params;
    }

    attach() {
        const { settings, network } = this.getParams();

        this.checkSettings(settings);

        network.post(
            '/oauth2',
            wrapError(async (req, res) => {
                // token here is an oauth2 token, not jwt
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

                // verify this short-living oauth2 token
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
                return res.header('Content-Type', 'application/json').send(
                    JSON.stringify({
                        token: await this.makeToken(userId),
                    }),
                );
            }),
        );

        network.post('/local', wrapError(async (req, res) => {}));

        network.post(
            '/verify',
            wrapError(async (req, res) => {
                const { token } = req.body;

                const payload = await this.decodeToken(token);

                return res
                    .set('Content-Type', 'application/json')
                    .send(JSON.stringify(payload || {}));
            }),
        );
    }

    async findOrCreateUser(provider, data) {
        const { userEntity } = this.getParams();

        const result = await userEntity.find({
            filter: {
                [`service.${provider}.id`]: data.id,
            },
            select: ['_id'],
        });

        let id = null;
        const user = _.get(result, 'data.0');
        if (user) {
            id = user.getId();
        }

        // add or update
        const sResult = await userEntity.save(id, this.adaptData(data));
        if (sResult.isOk()) {
            id = sResult.getData()._id;
        }

        return id;
    }

    adaptData(data) {
        const uData = {};

        const emails = data.emails;
        if (_.isArrayNotEmpty(emails)) {
            const userEmail = emails.find(email => email.type === 'account');
            if (userEmail && userEmail.value) {
                _.set(uData, this.getLoginField(), userEmail.value);
            }
        }

        uData.service = {};
        uData.service.google = {
            id: data.id,
        };

        if (data.name) {
            uData.profile = uData.profile || {};
            uData.profile.firstName = data.name.givenName || '';
            uData.profile.lastName = data.name.familyName || '';
        }

        return uData;
    }

    async makeToken(userId) {
        const { settings } = this.getParams();
        const tokenTTL = settings.get('auth.jwt.ttl', '7d');

        return new Promise((resolve, reject) => {
            jwt.sign(
                {
                    userId,
                },
                new Buffer(settings.get('auth.secret'), 'utf8'),
                {
                    expiresIn: tokenTTL,
                    algorithm: 'HS512',
                },
                (err, token) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(token);
                    }
                },
            );
        });
    }

    async decodeToken(token) {
        if (!_.isStringNotEmpty(token)) {
            return null;
        }

        const { settings } = this.getParams();

        return new Promise(resolve => {
            jwt.verify(
                token,
                new Buffer(settings.get('auth.secret'), 'utf8'),
                (err, decoded) => {
                    if (err) {
                        console.dir(err);
                    }
                    resolve(err ? null : decoded);
                },
            );
        });
    }

    checkSettings(settings) {
        const secret = settings.get('auth.secret');
        if (!_.isStringNotEmpty(secret)) {
            throw new Error('auth.secret not defined, unable to issue tokens');
        }
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
