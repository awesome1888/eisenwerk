import ReducerFabric from '../../shared/lib/reducer/fabric.js';

export const mountPoint = 'home';
export const {
    ENTER,
    LEAVE,
    READY,
    META_SET,
    HTTPCODE_SET,
} = ReducerFabric.makePageActions(mountPoint);

export const SUCCESS = `${mountPoint}.success`;
export const FAILURE = `${mountPoint}.failure`;

export default ReducerFabric.makePageReducer(
    mountPoint,
    {},
    {
        [SUCCESS]: (state, payload) => ({
            ...state,
            error: null,
            data: payload,
        }),
        [FAILURE]: (state, payload) => ({
            ...state,
            error: payload,
            data: {},
        }),
    },
);
