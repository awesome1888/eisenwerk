import { takeLatest, call, put, fork, all } from 'redux-saga/effects';
import * as reducer from './reducer.js';
// import Offer from '../../api/offers';
// import Auth from '../../api/auth';
import * as applicationReducer from '../../components/Application/reducer';

function* loadData() {
    try {
        const response = yield call(() => Offer.find({token: Auth.getToken()}));
        yield put({ type: reducer.HOME_REQUEST_ENDSUCCESS, payload: response });
    } catch (error) {
        if (error.message === '401') {
            yield put({ type: applicationReducer.APPLICATION_AUTHORIZED_UNSET});
        }
        yield put({ type: reducer.HOME_REQUEST_ENDFAILURE, error });
    }
}

export default function* watcher() {
    yield all([
        fork(function* loadDataGenerator() { yield takeLatest(reducer.HOME_REQUEST_START, loadData); }),
    ]);
}
