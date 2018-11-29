import ReducerFabric from '../../shared/lib/reducer/fabric';

export const mountPoint = 'application';

export const ENTER = `${mountPoint}.enter`;
export const READY = `${mountPoint}.ready`;
export const FAILURE = `${mountPoint}.failure`;

export const AUTHORIZED_SET = `${mountPoint}.authorized.set`;
export const AUTHORIZED_UNSET = `${mountPoint}.authorized.unset`;

export default ReducerFabric.makeReducer(
    mountPoint,
    {
        ready: false,
        error: null,
        authorized: false,
    },
    {
        [READY]: state => ({ ...state, ready: true }),
        [FAILURE]: (state, payload) => ({ ...state, error: payload }),
        [AUTHORIZED_SET]: state => ({ ...state, authorized: true }),
        [AUTHORIZED_UNSET]: state => ({ ...state, authorized: false }),
    },
);
