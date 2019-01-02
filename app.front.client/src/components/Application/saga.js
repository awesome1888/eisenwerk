import { takeLatest, put, fork, all, call } from 'redux-saga/effects';
import * as reducer from './reducer';

function* loadUser({ payload }) {
    try {
        console.dir('Loading user');
        console.dir(payload);
        const user = yield call(() =>
            payload.application.getAuthorization().getUser(payload.userId),
        );
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
    }
}

function* loadData({ payload }) {
    try {
        const auth = payload.getAuthorization();
        const token = auth.getToken();
        if (token) {
            const user = yield call(() => auth.getUser(token));
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
        }
    } catch (error) {
        if (__DEV__) {
            console.error(error);
        }
    }

    yield put({ type: reducer.READY });
}

export default function* watcher() {
    yield all([
        fork(function* loadDataGenerator() {
            yield takeLatest(reducer.ENTER, loadData);
        }),
        fork(function* loadDataGenerator() {
            yield takeLatest(reducer.USER_LOAD, loadUser);
        }),
    ]);
}
