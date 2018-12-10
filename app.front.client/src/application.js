import BaseApplication from './shared/lib/application/Web';

import React from 'react';
import { Provider } from 'react-redux';

import feathers from '@feathersjs/client';
import rest from '@feathersjs/rest-client';
import axios from 'axios';
import { ConnectedRouter } from 'connected-react-router';

import ReactApplication from './components/Application';
import * as applicationReducer from './components/Application/reducer';
import applicationSaga from './components/Application/saga';

import SorryScreen from './components/SorryScreen';
import routeMap from './routes/withUI';
import routeRender from './routes/render';
import Authorization from './shared/lib/vendor/feathersjs/authorization/client';
import Entity from './shared/lib/entity/client.js';
import Method from './shared/lib/vendor/feathersjs/method/client.js';

/**
 * todo: move this to lib
 */
export default class Application extends BaseApplication {
    getMainStoreElement() {
        return {
            reducer: applicationReducer,
            saga: applicationSaga,
        };
    }

    getRoutes() {
        return routeMap;
    }

    /**
     * Returns an instance of a "network" application, which manages REST, WebSocket
     * and other stuff that provides the client-server communications
     * @returns {*}
     */
    getNetwork() {
        if (!this._feathers) {
            const application = feathers();

            // https://docs.feathersjs.com/api/client/rest.html
            const restClient = rest(this.getSettings().getAPIURL());

            // see other options in
            // https://docs.feathersjs.com/api/client/rest.html
            application.configure(restClient.axios(axios));

            if (this.useAuth()) {
                Authorization.prepare({ application, storage: this._storage });

                // todo: connect it to the store
                application.on('authenticated', this.onLogin.bind(this));
                application.on('logout', this.onLogout.bind(this));
                application.on(
                    'reauthentication-error',
                    this.onReLoginError.bind(this),
                );
            }

            this._feathers = application;
        }

        return this._feathers;
    }

    getAuthorization() {
        if (!this.useAuth()) {
            return null;
        }

        if (!this._authorization) {
            this._authorization = new Authorization(
                this.getNetwork(),
                this.getSettings(),
            );
        }

        return this._authorization;
    }

    async launch() {
        await super.launch();

        // // tell all entities to use this network as default when making REST calls (this is important)
        Entity.setNetwork(this.getNetwork());
        Method.setNetwork(this.getNetwork());
    }

    async onLogin() {
        // todo: dispatch an action
    }

    onLogout() {
        // todo: dispatch an action
    }

    onReLoginError() {
        // todo: dispatch an action
    }

    renderRoutes(appProps) {
        const routes = this.getRoutes();
        return routeRender({ routes, appProps });
    }

    /**
     * This method is available both on server and client
     * @returns {*}
     */
    render() {
        return (
            <Provider store={this.getStore().getReduxStore()}>
                <ReactApplication
                    application={this}
                    useAuth={this.useAuth()}
                    routes={appProps => {
                        const applicationProps = {
                            useAuth: this.useAuth(),
                        };
                        if (this.useAuth()) {
                            Object.assign(applicationProps, {
                                user: appProps.user,
                            });
                        }

                        return (
                            <ConnectedRouter history={this.getHistory()}>
                                {this.renderRoutes(applicationProps)}
                            </ConnectedRouter>
                        );
                    }}
                />
            </Provider>
        );
    }

    /**
     * Render error server-side
     */
    renderError(error) {
        return <SorryScreen error={error} />;
    }
}
