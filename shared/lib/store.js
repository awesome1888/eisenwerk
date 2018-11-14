import { applyMiddleware, compose, createStore } from 'redux';
// import { connectRouter, routerMiddleware } from 'connected-react-router';
import { combineReducers } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { fork, all } from 'redux-saga/effects';

export default class Store {
    static make({pages, history, application}) {

        const self = new this();
        self._application = application;

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
        self._store = createStore(
          // connectRouter(history)(combineReducers(reducers.reduce((result, item) => {
          //     result[item.__root] = item;
          //     return result;
          // }, {}))),
          combineReducers(reducers.reduce((result, item) => {
              result[item.__root] = item;
              return result;
          }, {})),
          {},
          compose(
            applyMiddleware(
              // routerMiddleware(history),
              sagaMiddleware,
            ),
          ),
        );
        self._sagaHandler = sagaMiddleware.run(function* composeSagas() {
            yield all(sagas.map(saga => fork(saga)));
        });

        return self;
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
