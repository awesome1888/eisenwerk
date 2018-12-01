import { applyMiddleware, compose, createStore } from 'redux';
import { combineReducers } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { fork, all } from 'redux-saga/effects';
import logger from 'redux-logger';
import { connectRouter, routerMiddleware } from 'connected-react-router';

export default class Store {
    constructor(params = {}) {
        this._params = params;
    }

    init() {
        const {
            routes,
            application,
            alterMiddleware,
            alterReducers,
            history,
            initialState,
        } = this._params;
        this._application = application;

        const reducers = [application.reducer];
        const sagas = [application.saga];

        const pageList = Object.values(routes).map(r => r.page);
        pageList.forEach(page => {
            if (page) {
                if (page.reducer) {
                    reducers.push(page.reducer);
                }
                if (page.saga) {
                    sagas.push(page.saga);
                }
            }
        });

        const sagaMiddleware = createSagaMiddleware();

        let middlewares = [];
        if (_.isFunction(alterMiddleware)) {
            middlewares = alterMiddleware(middlewares);
        }
        middlewares.push(routerMiddleware(history));
        middlewares.push(sagaMiddleware);
        if (__DEV__ && !__SSR__) {
            middlewares.push(logger);
        }

        let cReducers = combineReducers(
            reducers.reduce((result, red) => {
                result[red.mountPoint] = red.default;
                return result;
            }, {}),
        );
        if (_.isFunction(alterReducers)) {
            cReducers = alterReducers(cReducers);
        }

        cReducers = connectRouter(history)(cReducers);

        this._store = createStore(
            cReducers,
            initialState || {},
            compose(applyMiddleware(...middlewares)),
        );
        this._sagaHandler = sagaMiddleware.run(function* composeSagas() {
            yield all(sagas.map(saga => fork(saga)));
        });
    }

    loadData(reducer, payload = {}) {
        const type = reducer.ENTER;
        if (!type) {
            // nothing to dispatch, it seems that the page does not load any data, consider it "ready"
            return true;
        }

        const store = this.getReduxStore();

        const checkReady = red => {
            const state = store.getState();
            return _.get(state, `${red.mountPoint}.ready`);
        };

        let unsubscribe = null;
        let timer = null;
        return new Promise((resolve, reject) => {
            if (checkReady(reducer, resolve) === true) {
                // it is already "ready", no need to dispatch anything
                resolve();
            } else {
                // subscribe to the store change, dispatch reducer.ENTER
                unsubscribe = store.subscribe(() => {
                    if (checkReady(reducer) === true) {
                        clearTimeout(timer);
                        resolve();
                    }
                });
                store.dispatch({ type, payload });
                timer = setTimeout(() => {
                    // 45 seconds passed, cant wait any longer, consider it "ready" as it is now
                    reject('Timeout');
                }, 45 * 1000);
            }
        })
            .then(() => {
                if (unsubscribe) {
                    unsubscribe();
                }
            })
            .catch(e => {
                if (unsubscribe) {
                    unsubscribe();
                }

                throw e;
            });
    }

    // application

    loadApplicationData() {
        return this.loadData(this._application.reducer);
    }

    getApplicationData() {
        return this.getStateAt(this._application.reducer.mountPoint);
    }

    // page

    loadPageData(page, route = {}) {
        return this.loadData(page.reducer, route);
    }

    getPageHttpCode(page) {
        const code = parseInt(
            this.getStateAt(`${page.reducer.mountPoint}.httpCode`),
            10,
        );
        if (!code || isNaN(code)) {
            return 200;
        }
        return code;
    }

    getPageMeta(page) {
        return _.get(
            this.getReduxStore().getState(),
            `${page.reducer.mountPoint}.meta`,
        );
    }

    getReduxStore() {
        return this._store;
    }

    getStateAt(point) {
        return _.get(this.getReduxStore().getState(), point);
    }

    shutdown() {
        if (this._sagaHandler) {
            this._sagaHandler.cancel();
        }
    }
}
