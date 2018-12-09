import feathers from '@feathersjs/feathers';
import express from '@feathersjs/express';
import errors from '@feathersjs/errors';

import escape from 'escape-html';
import Database from '../database';
import Authorization from '../authorization/server';
import handler from '../error-handler';
import MethodFabric from '../method/fabric';
import EntityServiceFabric from '../service/fabric';

import ServerApplication from './Server';
import Express from '../express';
import LordVader from '../ascii/vader';
import Yoda from '../ascii/yoda';

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
                    // do not relocate this line elsewhere!
                    Authorization.prepare(eApp, this.getSettings());

                    this.createEntityServices(eApp);
                    this.createMethods(eApp);

                    app.get('/', (req, res) => {
                        res.status(200);
                        if (this.getSettings().isProduction()) {
                            res.send(`<pre>${LordVader}</pre>`);
                        } else {
                            res.send(`
                                <style>body{font-family: sans-serif}</style>
                                <pre>${Yoda}</pre>
                                <h3>The entities following use you may, young Padawan:</h3>
                                <ul>
                                    ${this.getServices()
                                        .map(service => {
                                            return `<li><a href="${escape(
                                                service.getPath(),
                                            )}">${escape(
                                                service.getPath(),
                                            )}</a> &mdash; ${escape(
                                                service.getDesciption(),
                                            )}</li>`;
                                        })
                                        .join('')}
                            </ul>
                        `);
                        }
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

            // set up REST transport
            app.configure(express.rest());

            this._network = app;
        }

        return this._network;
    }

    hasNetwork() {
        return !!this._network;
    }

    getAuthorization() {
        if (!this._authorization) {
            this._authorization = new Authorization(
                this.getNetwork(),
                this.getSettings(),
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

    createEntityServices(network) {
        EntityServiceFabric.register(network, this.getServices());
    }

    createMethods(network) {
        MethodFabric.register(network, this.getMethods());
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
        super.tearDown();
    }
}
