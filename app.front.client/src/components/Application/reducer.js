import ReducerFabric from "../../shared/lib/reducer/fabric.js";

export const ENTER = "application.start";
export const DONE = "application.done";

export const AUTHORIZED_SET = "application.authorized.set";
export const AUTHORIZED_UNSET = "application.authorized.unset";

export default ReducerFabric.make(
  "application",
  {
    ready: false,
    authorized: false
  },
  {
    [DONE]: state => ({ ...state, ready: true }),
    [AUTHORIZED_SET]: state => ({ ...state, authorized: true }),
    [AUTHORIZED_UNSET]: state => ({ ...state, authorized: false })
  }
);
