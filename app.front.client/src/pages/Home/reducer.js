import ReducerFabric from '../../shared/lib/reducer/fabric.js';

export const code = 'home';
export const {
    ENTER,
    LEAVE,
    READY,
    META_SET,
    HTTPCODE_SET,
} = ReducerFabric.makePageActions(code);

export const SUCCESS = `${code}.success`;
export const FAILURE = `${code}.failure`;

export default ReducerFabric.makePageReducer(
    code,
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
