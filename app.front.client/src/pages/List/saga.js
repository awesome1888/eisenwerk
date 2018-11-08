import { takeLatest, call, put, fork, all } from 'redux-saga/effects';
import * as reducer from './reducer.js';
// import Auth from '../../api/auth';
import * as applicationReducer from '../../components/Application/reducer';
import axios from 'axios';

function* loadData() {
    try {
        const response = yield call(() => axios.get('https://swapi.co/api/people/'));
        yield put({ type: reducer.LIST_REQUEST_ENDSUCCESS, payload: response.data.results });
    } catch (error) {
        if (error.message === '401') {
            yield put({ type: applicationReducer.APPLICATION_AUTHORIZED_UNSET});
        }
        yield put({ type: reducer.LIST_REQUEST_ENDFAILURE, payload: error });
    }
}

export default function* watcher() {
    yield all([
        fork(function* loadDataGenerator() { yield takeLatest(reducer.LIST_REQUEST_START, loadData); }),
    ]);
}
