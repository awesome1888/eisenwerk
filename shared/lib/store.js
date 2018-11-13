import { applyMiddleware, compose, createStore } from 'redux';
// import { connectRouter, routerMiddleware } from 'connected-react-router';
import { combineReducers } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { fork, all } from 'redux-saga/effects';

export default class Store {
    static make({pages, history, mainReducer}) {

        const self = new this();

        const reducers = [
            mainReducer,
        ];
        const sagas = [];

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

    getReduxStore() {
        return this._store;
    }

    shutdown() {
        if (this._sagaHandler) {
            this._sagaHandler.cancel();
        }
    }
}
