import feathers from '@feathersjs/feathers';
import express from '@feathersjs/express';
import helmet from 'helmet';
import cors from 'cors';
import errors from '@feathersjs/errors';

import BaseApplication from './base.js';
import Database from '../../database/index.js';
import Authorization from '../../util/authorization/server.js';
import handler from '../../util/error/server/handler.js';
import MethodFabric from '../../util/method/fabric.js';
import EntityServiceFabric from '../../entity/service/fabric.js';
import qs from 'qs';

// const util = require('util');

export default class BaseFeathersApplication extends BaseApplication {

    getNetwork() {
        if (!this._feathers) {
            this._feathers = express(feathers());
            this._feathers.set('query parser', (query) => {
                // increase the default parse depth and disable allowPrototypes
                return qs.parse(query, {allowPrototypes: false, depth: 10});
            });

            // this._feathers.use('/users', (req, res, next) => {
            //     console.log(util.inspect(req.query, {showHidden: false, depth: null}));
            //     next();
            // });
        }

        return this._feathers;
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

    attachBaseMiddleware() {
        const app = this.getNetwork();

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
        app.use(helmet());
        // turn on JSON parser for REST services
        app.use(express.json());
        // turn on URL-encoded parser for REST services
        app.use(express.urlencoded({
            extended: true,
        }));

        // set up REST transport
        app.configure(express.rest());
    }

    attachSpecialMiddleware() {
        const app = this.getNetwork();

        // authorization
        // do not relocate this line elsewhere!
        Authorization.prepare(app, this.getSettings());

        this.createEntityServices();
        this.createMethods();
    }

    attachNotFoundMiddleware() {
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
        this.getServices().forEach((service) => {
            EntityServiceFabric.make(this, service);
        });
    }

    createMethods() {
        MethodFabric.register(this, this.getMethods());
    }

    async launch() {
        await this.connectDatabase();
        await super.launch();
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
