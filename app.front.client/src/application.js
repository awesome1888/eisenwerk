import BaseApplication from './shared/lib/application/client/feathers.js';

import React from 'react';
import { Provider } from 'react-redux';
import Store from './shared/lib/store';

import ApplicationUI from './components/Application';
import * as applicationReducer from './components/Application/reducer';
import applicationSaga from './components/Application/saga';
import { createBrowserHistory, createMemoryHistory } from 'history';
import { ConnectedRouter } from 'connected-react-router';
import { Switch } from 'react-router';
import Route from './shared/components/Route';

import LayoutOuter from './components/LayoutOuter';
import PageLoader from './shared/components/PageLoader';
import SorryScreen from './components/SorryScreen';

import routeMap from './routes';

/**
 * todo: move this to lib
 */
export default class Application extends BaseApplication {
    getRoutes() {
        return routeMap;
    }

    getStore() {
        if (!this._store) {
            const redux = this._props.redux || {};
            this._store = new Store({
                ...redux,
                application: {
                    reducer: applicationReducer,
                    saga: applicationSaga,
                },
                routes: this.getRoutes(),
                history: this.getHistory(),
            });
            this._store.init();
        }

        return this._store;
    }

    getHistory() {
        if (!this._history) {
            let history = null;
            if (__SSR__) {
                history = createMemoryHistory({
                    initialEntries: [this.getCurrentURL()],
                });
            } else {
                history = createBrowserHistory();
            }

            this._history = history;
        }

        return this._history;
    }

    getCurrentURL() {
        return this._props.currentURL || '/';
    }

    renderRoutes() {
        const routes = this.getRoutes();

        return (
            <Switch>
                <Route
                    {...routes.home}
                    render={route => (
                        <LayoutOuter>
                            <PageLoader page={routes.home.page} route={route} />
                        </LayoutOuter>
                    )}
                />
                <Route
                    {...routes.list}
                    render={route => (
                        <LayoutOuter>
                            <PageLoader page={routes.list.page} route={route} />
                        </LayoutOuter>
                    )}
                />
                <Route
                    {...routes.restricted}
                    render={route => (
                        <LayoutOuter>
                            <PageLoader
                                page={routes.restricted.page}
                                route={route}
                            />
                        </LayoutOuter>
                    )}
                />
                <Route
                    render={route => (
                        <LayoutOuter>
                            <PageLoader
                                page={routes.notFound.page}
                                route={route}
                            />
                        </LayoutOuter>
                    )}
                />
            </Switch>
        );
    }

    /**
     * This method is available both on server and client
     * @returns {*}
     */
    render() {
        return (
            <Provider store={this.getStore().getReduxStore()}>
                <ApplicationUI application={this} useAuth={this.useAuth()}>
                    <ConnectedRouter history={this.getHistory()}>
                        {this.renderRoutes()}
                    </ConnectedRouter>
                </ApplicationUI>
            </Provider>
        );
    }

    /**
     * Render error server-side
     */
    renderError(error) {
        return <SorryScreen error={error} />;
    }

    async teardown() {
        if (this._store) {
            this._store.shutdown();
        }
    }
}
