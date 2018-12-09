import express from 'express';
import helmet from 'helmet';
import responseTime from 'response-time';
import qs from 'qs';
import cors from 'cors';

import { makeStatus } from './util';

/**
 * This is an express-proxy, which does all internal setup. I have decided to
 * proceed with this instead of simple fabric.
 */
export default class ExpressApplication {
    constructor(params = {}) {
        this._params = params;
    }

    async launch() {
        this.createServer();
    }

    getApp() {
        if (!this._express) {
            const app = this.getParams().app ? this.getParams().app : express();

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

            const origins = this.getParams().cors;
            if (_.isArrayNotEmpty(origins)) {
                app.use(
                    cors({
                        origin: (origin, cb) => {
                            // allow requests with no origin, like mobile apps or curl requests
                            if (!origin || _.contains(origins, origin)) {
                                return cb(null, true);
                            }

                            return cb(new Error(), false);
                        },
                    }),
                );
            }

            const pFolder = this.getParams().publicFolder;
            if (_.isStringNotEmpty(pFolder)) {
                app.use('/', express.static(pFolder));
            }

            // the following settings are sometimes used inside different plugins
            const hostname = this.getParams().hostname;
            if (_.isStringNotEmpty(hostname)) {
                app.set('host', hostname);
            }
            app.set('port', this.getParams().port);

            // increase the default parse depth of a query string and disable allowPrototypes
            app.set('query parser', query => {
                return qs.parse(query, { allowPrototypes: false, depth: 10 });
            });

            this.attachMiddleware(app);
            this.attachErrorTrigger(app);
            this.attachErrorHandler(app);

            this._express = app;
        }

        return this._express;
    }

    attachMiddleware(app) {
        if (_.isFunction(this.getParams().registerMiddleware)) {
            this.getParams().registerMiddleware(app);
        }
    }

    attachErrorHandler(app) {
        if (_.isFunction(this.getParams().attachErrorHandler)) {
            this.getParams().attachErrorHandler(app);
        } else {
            // attach the default one
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
    }

    attachErrorTrigger(app) {
        const mkErr = this.getParams().makeError;

        // if nothing were served above with GET, then we should obviously send 404
        app.get(() => {
            let error = null;
            if (_.isFunction(mkErr)) {
                error = mkErr(404);
            }
            if (!error) {
                error = new Error('404');
            }

            throw error;
        });

        // all the rest - not implemented
        app.use(() => {
            let error = null;
            if (_.isFunction(mkErr)) {
                error = mkErr(501);
            }
            if (!error) {
                error = new Error('501');
            }

            throw error;
        });
    }

    createServer() {
        const port = this.getParams().port;
        this._server = this.getApp().listen(port);
        this._server.on('listening', () => {
            console.log(`Listening on ${port} port`);
        });
    }

    configure(how) {
        if (_.isFunction(this.getApp().configure)) {
            this.getApp().configure(how);
        }
    }

    service(which) {
        if (_.isFunction(this.getApp().service)) {
            this.getApp().service(which);
        }
    }

    use(...args) {
        this.getApp().use(...args);
    }

    get(...args) {
        this.getApp().get(...args);
    }

    post(...args) {
        this.getApp().post(...args);
    }

    put(...args) {
        this.getApp().put(...args);
    }

    patch(...args) {
        this.getApp().patch(...args);
    }

    delete(...args) {
        this.getApp().delete(...args);
    }

    getParams() {
        return this._params;
    }

    tearDown() {}
}
