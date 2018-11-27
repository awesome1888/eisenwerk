import { takeLatest, call, put, fork, all } from "redux-saga/effects";
import * as reducer from "./reducer";
import * as applicationReducer from "../../components/Application/reducer";

function* loadData() {
  try {
    // const response = yield call(() => Offer.find({token: Auth.getToken()}));
    const response = {};
    yield put({ type: reducer.REQUEST_ENDSUCCESS, payload: response });
    yield put({
      type: reducer.META_SET,
      payload: {
        title: "Home",
        description: "Home page",
        keywords: ["home", "page"]
      }
    });
  } catch (error) {
    if (error.message === "401") {
      yield put({ type: applicationReducer.AUTHORIZED_UNSET });
    }
    yield put({ type: reducer.HTTPCODE_SET, payload: error.message });

    yield put({ type: reducer.REQUEST_ENDFAILURE, payload: error });
  }

  yield put({ type: reducer.READY });
}

export default function* watcher() {
  yield all([
    fork(function* loadDataGenerator() {
      yield takeLatest(reducer.ENTER, loadData);
    })
  ]);
}
