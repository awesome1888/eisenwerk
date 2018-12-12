import { takeLatest, put, fork, all, call } from 'redux-saga/effects';
import * as reducer from './reducer';
import User from '../../shared/api/user/entity/client';
// import { makeStatus } from '../../shared/lib/util';

function* loadData() {
    yield put({ type: reducer.READY });
}

function* loadUser({ payload }) {
    try {
        const user = yield call(() => User.get(payload));
        if (user) {
            yield put({
                type: reducer.AUTHORIZED_SET,
                payload: user,
            });
        } else {
            yield put({
                type: reducer.AUTHORIZED_UNSET,
            });
        }
    } catch (error) {
        if (__DEV__) {
            console.error(error);
        }

        // todo: show some error here maybe
        // const status = makeStatus(error);
        // yield put({ type: reducer.HTTPCODE_SET, payload: status });
    }
}

export default function* watcher() {
    yield all([
        fork(function* loadDataGenerator() {
            yield takeLatest(reducer.ENTER, loadData);
        }),
        fork(function* loadDataGenerator() {
            yield takeLatest(reducer.AUTHORIZED, loadUser);
        }),
    ]);
}
