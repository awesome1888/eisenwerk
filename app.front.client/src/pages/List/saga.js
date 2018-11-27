import { takeLatest, call, put, fork, all } from "redux-saga/effects";
import * as reducer from "./reducer.js";
// import Auth from '../../api/auth';
import * as applicationReducer from "../../components/Application/reducer";
import axios from "axios";

function* loadData() {
  try {
    const response = yield call(() =>
      axios.get("https://swapi.co/api/people/")
    );
    yield put({
      type: reducer.REQUEST_ENDSUCCESS,
      payload: response.data.results
    });
    yield put({
      type: reducer.META_SET,
      payload: {
        title: "List",
        description: "List page",
        keywords: ["home", "list"]
      }
    });
  } catch (error) {
    if (error.message === "401") {
      yield put({ type: applicationReducer.AUTHORIZED_UNSET });
    }
    yield put({ type: reducer.HTTPCODE_SET, payload: error.message });

    yield put({ type: reducer.REQUEST_ENDFAILURE, payload: error });
  }

  yield put({ type: reducer.DONE });
}

export default function* watcher() {
  yield all([
    fork(function* loadDataGenerator() {
      yield takeLatest(reducer.ENTER, loadData);
    })
  ]);
}
