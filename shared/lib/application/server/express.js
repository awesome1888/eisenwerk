import express from 'express';
import helmet from 'helmet';
import responseTime from 'response-time';

import Oauth2Success from '../../authorization/oauth2-success';
import { makeStatus } from '../../util';
import settings from '../../settings/server.js';

export default class ExpressApplication {
    constructor(params = {}) {
        this._params = params;
    }

    async launch() {
        process.on('unhandledRejection', (reason, p) => {
            console.log('Unhandled Rejection at: ', p, ' reason: ', reason);
        });
        process.on('uncaughtException', err => {
            console.log('Uncaught Exception thrown ', err);
            this.tearDown();
        });

        this.getSettings().checkMandatory();

        this.attachMiddleware();
        this.attachErrorTrigger();
        this.attachErrorHandler();

        this.createServer();
    }

    getNetwork() {
        if (!this._express) {
            const app = express();

            app.use(helmet());
            // turn on JSON parser for REST services
            app.use(express.json());
            // turn on URL-encoded parser for REST services
            app.use(
                express.urlencoded({
                    extended: true,
                }),
            );
            app.use(responseTime());

            // app.use(ConditionalGet());
            // app.use(ETag());

            const pFolder = this.getSettings().getPublicFolder();
            if (pFolder !== false) {
                app.use('/', express.static(pFolder));
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
            if (res.headersSent) {
                return next(error);
            }

            const status = makeStatus(error.message);
            res.status(status);

            res.send(status === 404 ? 'Not found' : 'Error');
            return true;
        });
    }

    attachErrorTrigger() {
        // if nothing were served above with GET, then we should obviously send 404
        this.getNetwork().get(() => {
            throw new Error('404');
        });
        // all the rest - not implemented
        this.getNetwork().use(() => {
            throw new Error('501');
        });
    }

    createServer() {
        const port = this.getSettings().getPort();
        this._server = this.getNetwork().listen(port);
        this._server.on('listening', () => {
            console.log(`Listening on ${port} port`);
        });
    }

    tearDown() {
        process.exit(1);
    }

    getSettings() {
        return settings;
    }

    getParams() {
        return this._params;
    }
}
