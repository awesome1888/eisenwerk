import { takeLatest, put, fork, all } from 'redux-saga/effects';
import * as reducer from './reducer';
import * as applicationReducer from '../../components/Application/reducer';
import { makeStatus } from '../../shared/lib/util';

function* loadData() {
    try {
        const response = {};
        yield put({
            type: reducer.META_SET,
            payload: {
                title: 'Login',
                description: 'Login page',
                keywords: ['login', 'page'],
            },
        });
        yield put({ type: reducer.SUCCESS, payload: response });
    } catch (error) {
        if (__DEV__) {
            console.error(error);
        }

        const status = makeStatus(error);
        if (status === 401) {
            yield put({ type: applicationReducer.AUTHORIZED_UNSET });
        }
        yield put({ type: reducer.HTTPCODE_SET, payload: status });

        yield put({ type: reducer.FAILURE, payload: error });
    }

    yield put({ type: reducer.READY });
}

export default function* watcher() {
    yield all([
        fork(function* loadDataGenerator() {
            yield takeLatest(reducer.ENTER, loadData);
        }),
    ]);
}
