import express from 'express';
import helmet from 'helmet';
import responseTime from 'response-time';

import BaseApplication from './base.js';
import Settings from '../../util/settings/server.js';

import Oauth2Success from '../../util/authorization/oauth2-success.js';

export default class BaseExpressApplication extends BaseApplication {

    getNetwork() {
        if (!this._express) {
            const app = express();

            app.use(helmet());
            // turn on JSON parser for REST services
            app.use(express.json());
            // turn on URL-encoded parser for REST services
            app.use(express.urlencoded({
                extended: true,
            }));
            app.use(responseTime());

            // app.use(ConditionalGet());
            // app.use(ETag());

            const pFolder = Settings.getInstance().getPublicFolder();
            if (pFolder !== false) {
                app.use('/public', express.static(pFolder));

                // if nothing were served by static, and we are still here, then we should obviously send 404
                app.use('/public', () => {
                    throw new Error('404');
                });
            }

            this._express = app;
        }

        return this._express;
    }

    attachMiddleware() {
        Oauth2Success.attach(this.getNetwork());
    }

    attachErrorHandler() {
        const app = this.getNetwork();

        // dont remove "next", because...
        // https://expressjs.com/en/guide/using-middleware.html#middleware.error-handling
        app.use((error, req, res, next) => {
            const code = parseInt(error.message, 10);
            res.status(code === 404 ? 404 : 500);
            res.send(code === 404 ? 'Not found' : 'Server error');
        });
    }
}
