import feathers from '@feathersjs/feathers';
import express from '@feathersjs/express';
import helmet from 'helmet';
import cors from 'cors';
import errors from '@feathersjs/errors';

import BaseApplication from './base.js';
import Database from '../../util/database';
import Authorization from '../../util/authorization/server.js';
import handler from '../../util/error-handler.js';
import MethodFabric from '../../util/method/fabric.js';
import EntityServiceFabric from '../../service/fabric.js';
import qs from 'qs';

export default class BaseFeathersApplication extends BaseApplication {

    getNetwork() {
        if (!this._network) {
            const app = express(feathers());

            // increase the default parse depth of a query string and disable allowPrototypes
            app.set('query parser', (query) => {
                return qs.parse(query, {allowPrototypes: false, depth: 10});
            });

            const settings = this.getSettings();

            // the following settings are sometimes used inside different featherjs plugins
            app.set('host', settings.getRootURLParsed().hostname);
            app.set('port', settings.getPort());

            const origins = this.getSettings().getAllowedOrigins();
            if (_.isArrayNotEmpty(origins)) {
                app.use(cors({
                    origin: (origin, cb) => {
                        // allow requests with no origin, like mobile apps or curl requests
                        if (!origin || _.contains(origins, origin)) {
                            return cb(null, true);
                        }

                        return cb(new Error(), false);
                    },
                }));
            }

            // add security headers
            app.use(helmet());

            // turn on JSON parser
            app.use(express.json());

            // turn on URL-encoded parser
            app.use(express.urlencoded({
                extended: true,
            }));

            // set up REST transport
            app.configure(express.rest());

            this._network = app;
        }

        return this._network;
    }

    getAuthorization() {
        if (!this._authorization) {
            this._authorization = new Authorization(this.getNetwork(), this.getSettings());
        }

        return this._authorization;
    }

    getServices() {
        return [];
    }

    getMethods() {
        return [];
    }

    attachMiddleware() {
        const app = this.getNetwork();

        // do not relocate this line elsewhere!
        Authorization.prepare(app, this.getSettings());

        this.createEntityServices();
        this.createMethods();
    }

    attachErrorHandler() {
        const app = this.getNetwork();

        // 404 generator
        app.use(() => {
            // if we reached this point with no error, it is time for 404 error!
            throw new errors.NotFound('Resource not found');
        });

        // error handler
        app.use(handler({
            isProduction: this.getSettings().isProduction(),
        }));
    }

    createEntityServices() {
        EntityServiceFabric.register(this, this.getServices());
    }

    createMethods() {
        MethodFabric.register(this, this.getMethods());
    }

    async launch() {
        await this.connectDatabase();
        return super.launch();
    }

    async connectDatabase() {
        const dbString = this.getSettings().getDatabaseURL();

        if (_.isStringNotEmpty(dbString)) {
            this._connection = new Database();
            await this._connection.connect(dbString);
        } else {
            this._connection = null;
        }
    }
}
