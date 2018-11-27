import ReducerFabric from "../../shared/lib/reducer/fabric.js";

export const code = "list";
export const {
  ENTER,
  LEAVE,
  READY,
  META_SET,
  HTTPCODE_SET
} = ReducerFabric.makePageActions(code);

export const REQUEST_START = `${code}.request.start`;
export const REQUEST_ENDSUCCESS = `${code}.request.end-success`;
export const REQUEST_ENDFAILURE = `${code}.request.end-failure`;

export default ReducerFabric.makePage(
  code,
  {},
  {
    [REQUEST_START]: state => ({
      ...state,
      loading: true,
      error: null,
      data: {}
    }),
    [REQUEST_ENDSUCCESS]: (state, payload) => ({
      ...state,
      loading: false,
      error: null,
      data: payload
    }),
    [REQUEST_ENDFAILURE]: (state, payload) => ({
      ...state,
      loading: false,
      error: payload,
      data: {}
    })
  }
);
