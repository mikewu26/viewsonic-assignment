import { call, put } from 'redux-saga/effects';
import axios from 'axios';

function postRequest(url, data, signal) {
  return axios({
    method: 'POST',
    url,
    data,
    signal,
  });
}

const ACTION_TYPES = {
  FETCH_SUCCESS: 'FETCH_SUCCESS',
  FETCH_FAILURE: 'FETCH_FAILURE',
  FETCH_ABORTED: 'FETCH_ABORTED',
  FETCH_EXCEPTION: 'FETCH_EXCEPTION',
};

function* function1(action, ctrl) {
  try {
    const { data } = yield call(
      postRequest,
      'https://some-endpoint-url.com',
      action.payload,
      ctrl.signal,
    );
    yield put({ type: ACTION_TYPES.FETCH_SUCCESS, payload: data });
  } catch (e) {
    if (e.response) {
      yield put({ type: ACTION_TYPES.FETCH_FAILURE, payload: e.response });
    } else {
      yield put({ type: ACTION_TYPES.FETCH_EXCEPTION, payload: e.request });
    }
  } finally {
    if (ctrl.signal.aborted) {
      yield put({ type: ACTION_TYPES.FETCH_ABORTED });
    }
  }
}

function function2(ctrl) {
  ctrl.abort();
}

export { function1, function2, postRequest, ACTION_TYPES };
