import { applyMiddleware, compose, createStore } from 'redux';
// import { connectRouter, routerMiddleware } from 'connected-react-router';
import { combineReducers } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { fork, all } from 'redux-saga/effects';

// import history from '../lib/history';
import reducers from './reducers';
import sagas from './sagas';

const sagaMiddleware = createSagaMiddleware();
const store = createStore(
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
sagaMiddleware.run(function* composeSagas() {
    yield all(sagas.map(saga => fork(saga)));
});

export default store;
