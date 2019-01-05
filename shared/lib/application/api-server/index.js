import feathers from '@feathersjs/feathers';
import express from '@feathersjs/express';
import errors from '@feathersjs/errors';

import Database from '../../database';
import handler from '../../vendor/feathersjs/error-handler';
import MethodFabric from '../../vendor/feathersjs/method/fabric';
import render from './render';

import Server from '../server';
import Express from '../../express';

export default class APIServer extends Server {
    async launch() {
        process.on('unhandledRejection', (reason, p) => {
            console.log('Unhandled Rejection at: ', p, ' reason: ', reason);
        });
        process.on('uncaughtException', err => {
            console.log('Uncaught Exception thrown ', err);
            this.tearDown();
        });

        this.getSettings().checkMandatory();
        this.getNetwork().launch();

        await this.connectDatabase();
    }

    getNetwork() {
        if (!this._network) {
            const settings = this.getSettings();
            this._network = new Express({
                app: express(feathers()),
                port: settings.getPort(),
                hostname: settings.getRootURLParsed().hostname,
                cors: settings.getAllowedOrigins(),
                registerMiddleware: eApp => {
                    // set up REST transport
                    eApp.configure(express.rest());

                    this.getAuthentication(eApp);

                    // expose headers due to
                    // https://github.com/feathers-plus/feathers-hooks-common/issues/306
                    eApp.use((req, res, next) => {
                        req.feathers = {
                            ...req.feathers,
                            headers: req.headers,
                        };
                        next();
                    });

                    this.attachMiddleware(eApp);
                    eApp.get('/', (req, res) => {
                        res.status(200);
                        res.send(
                            render({
                                application: this,
                            }),
                        );
                    });
                },
                attachErrorHandler: eApp => {
                    eApp.use(
                        handler({
                            isProduction: this.getSettings().isProduction(),
                        }),
                    );
                },
                makeError: code => {
                    if (code === 404) {
                        return new errors.NotFound('Resource not found');
                    }

                    return null;
                },
            });
        }

        return this._network;
    }

    hasNetwork() {
        return !!this._network;
    }

    getAuthentication() {
        return null;
    }

    // todo: tmp
    getAuthorization() {
        return this.getAuthentication();
    }

    getServices() {
        return [];
    }

    getMethods() {
        return [];
    }

    attachMiddleware(eApp) {
        this.attachEntityServices(eApp);
        this.attachMethods(eApp);
    }

    attachEntityServices(network) {
        this.getServices().forEach(service => {
            // make instance
            const serviceInstance = service.make(this);
            // register middleware
            network.use(serviceInstance.getPath(), serviceInstance);
            // apply hooks
            const hooks = serviceInstance.getHooks();
            if (_.isObjectNotEmpty(hooks)) {
                network.service(serviceInstance.getName()).hooks(hooks.get());
            }
        });
    }

    attachMethods(network) {
        MethodFabric.register(this, network, this.getMethods());
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

    tearDown() {
        if (this.hasNetwork()) {
            this.getNetwork().tearDown();
        }
        // todo: disconnect from the db here
        super.tearDown();
    }
}
