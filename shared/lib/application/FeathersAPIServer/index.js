import feathers from '@feathersjs/feathers';
import express from '@feathersjs/express';
import errors from '@feathersjs/errors';

import Database from '../../database';
import Authorization from '../../vendor/feathersjs/authorization/server';
import handler from '../../vendor/feathersjs/error-handler';
import MethodFabric from '../../vendor/feathersjs/method/fabric';
import EntityServiceFabric from '../../vendor/feathersjs/service/fabric';
import render from './render';

import ServerApplication from '../Server';
import Express from '../../express';

export default class FeathersAPIServerApplication extends ServerApplication {
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
            const sett = this.getSettings();
            const app = new Express({
                app: express(feathers()),
                port: sett.getPort(),
                hostname: sett.getRootURLParsed().hostname,
                cors: sett.getAllowedOrigins(),
                registerMiddleware: eApp => {
                    // set up REST transport
                    eApp.configure(express.rest());

                    if (sett.useAuth()) {
                        // do not relocate this line elsewhere!
                        Authorization.prepare(
                            eApp,
                            this.getSettings(),
                            this.getUserEntity(),
                        );
                    }

                    this.createEntityServices(eApp);
                    this.createMethods(eApp);

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

            this._network = app;
        }

        return this._network;
    }

    hasNetwork() {
        return !!this._network;
    }

    getAuthorization() {
        if (!this.getSettings().useAuth()) {
            return null;
        }

        if (!this._authorization) {
            this._authorization = new Authorization(
                this.getNetwork(),
                this.getSettings(),
                this.getUserEntity(),
            );
        }

        return this._authorization;
    }

    getServices() {
        return [];
    }

    getMethods() {
        return [];
    }

    getUserEntity() {
        return null;
    }

    createEntityServices(network) {
        EntityServiceFabric.register(this, network, this.getServices());
    }

    createMethods(network) {
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
