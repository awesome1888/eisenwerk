import BaseApplication from './shared/lib/application/Web';

import React from 'react';
import { Provider } from 'react-redux';

import feathers from '@feathersjs/client';
import rest from '@feathersjs/rest-client';
import axios from 'axios';
import { ConnectedRouter } from 'connected-react-router';
import Emitter from 'tiny-emitter';

import ReactApplication from './components/Application';
import * as applicationReducer from './components/Application/reducer';
import applicationSaga from './components/Application/saga';

import SorryScreen from './components/SorryScreen';
import routeMap from './routes/withUI';
import routeRender from './routes/render';
// import Authorization from './shared/lib/vendor/feathersjs/authorization/client';
import Authentication from './shared/lib/authentication/front-client-web';
import Entity from './shared/lib/entity/client.js';
import Method from './shared/lib/vendor/feathersjs/method/client.js';

import User from './shared/api/user/entity/client';
import { context as applicationContext } from './context/application';

export default class Application extends BaseApplication {
    getReducer() {
        return applicationReducer;
    }

    getMainStoreElement() {
        return {
            reducer: this.getReducer(),
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

            this.getAuthentication(application);

            this._feathers = application;
        }

        return this._feathers;
    }

    // todo: tmp
    getAuthorization() {
        return this.getAuthentication();
    }

    getAuthentication(network = null) {
        if (!this._authorization) {
            this._authorization = new Authentication({
                network: network || this.getNetwork(),
                settings: this.getSettings(),
                userEntity: User,
            });
        }

        return this._authorization;
    }

    getEmitter() {
        if (!this._emitter) {
            this._emitter = new Emitter();
        }

        return this._emitter;
    }

    async launch() {
        await super.launch();

        // // tell all entities to use this network as default when making REST calls (this is important)
        Entity.setNetwork(this.getNetwork());
        Method.setNetwork(this.getNetwork());
    }

    makeRouteProperties(appProps) {
        const routeProps = {
            useAuth: this.useAuth(),
            application: this,
        };
        if (this.useAuth()) {
            routeProps.user = appProps.user;
        }

        return routeProps;
    }

    renderRoutes(routeProperties) {
        const routes = this.getRoutes();
        return routeRender({ routes, routeProperties });
    }

    /**
     * This method is available both on server and client
     * @returns {*}
     */
    render() {
        return (
            <Provider store={this.getStore().getReduxStore()}>
                <applicationContext.Provider value={this}>
                    <ReactApplication
                        application={this}
                        useAuth={this.useAuth()}
                        routes={appProps => {
                            return (
                                <ConnectedRouter history={this.getHistory()}>
                                    {this.renderRoutes(
                                        this.makeRouteProperties(appProps),
                                    )}
                                </ConnectedRouter>
                            );
                        }}
                    />
                </applicationContext.Provider>
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
