import { applyMiddleware, compose, createStore } from 'redux';
import { combineReducers } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { fork, all } from 'redux-saga/effects';
import logger from 'redux-logger';
import {connectRouter, routerMiddleware} from 'connected-react-router';

export default class Store {

    constructor(params = {}) {
        this._params = params;
    }

    init() {
        const {pages, application, alterMiddleware, alterReducers, history, initialState} = this._params;
        this._application = application;

        const reducers = [
            application.reducer,
        ];
        const sagas = [
            application.saga,
        ];

        pages.forEach((page) => {
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

        let cReducers = combineReducers(reducers.reduce((result, item) => {
            result[item.__root] = item;
            return result;
        }, {}));
        if (_.isFunction(alterReducers)) {
            cReducers = alterReducers(cReducers);
        }

        cReducers = connectRouter(history)(cReducers);

        this._store = createStore(
          cReducers,
          initialState || {},
          compose(
            applyMiddleware(...middlewares),
          ),
        );
        this._sagaHandler = sagaMiddleware.run(function* composeSagas() {
            yield all(sagas.map(saga => fork(saga)));
        });
    }

    loadData(type, reducer, payload = {}) {
        const store = this.getReduxStore();

        let unsubscribe = null;
        return new Promise((resolve, reject) => {
            unsubscribe = store.subscribe(() => {
                const state = store.getState();
                const ready = _.get(state, `${reducer.__root}.ready`);
                if (ready === true) {
                    resolve();
                }
            });
            store.dispatch({type, payload});
            setTimeout(() => {
                reject('Timeout');
            }, 45 * 1000);
        }).then(() => {
            if (unsubscribe) {
                unsubscribe();
            }
        }).catch((e) => {
            if (unsubscribe) {
                unsubscribe();
            }

            throw e;
        });
    }

    loadApplicationData() {
        return this.loadData(this._application.initial, this._application.reducer);
    }

    loadPageData(page, route = {}) {
        return this.loadData(page.initial, page.reducer, route);
    }

    getPageData(page) {
        return _.get(this.getReduxStore().getState(), page.reducer.__root);
    }

    checkApplicationData() {
        const appData = _.get(this.getReduxStore().getState(), this._application.reducer.__root);
        return appData.ready === true; // todo: so far only this
    }

    getReduxStore() {
        return this._store;
    }

    shutdown() {
        if (this._sagaHandler) {
            this._sagaHandler.cancel();
        }
    }
}
