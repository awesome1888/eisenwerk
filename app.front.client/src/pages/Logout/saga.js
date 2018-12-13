import { takeLatest, put, call } from 'redux-saga/effects';
import * as reducer from './reducer';
import * as applicationReducer from '../../components/Application/reducer';

function* loadData({ payload }) {
    yield call(() => payload.application.getAuthorization().signOut());
    yield put({ type: applicationReducer.AUTHORIZED_UNSET });
}

export default function* watcher() {
    yield takeLatest(reducer.ENTER, loadData);
}
