import { takeLatest, put, fork, all } from "redux-saga/effects";
import * as reducer from "./reducer";

function* loadData() {
  yield put({ type: reducer.READY });
}

export default function* watcher() {
  yield all([
    fork(function* loadDataGenerator() {
      yield takeLatest(reducer.ENTER, loadData);
    })
  ]);
}
