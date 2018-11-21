import ReducerFabric from '../../shared/lib/reducer/fabric.js';

export const code = 'list';

export const LIST_ENTER = 'list.enter';
export const LIST_LEAVE = 'list.leave';
export const LIST_DONE = 'list.done';
export const LIST_META_SET = 'list.meta.set';
export const LIST_HTTPCODE_SET = 'list.http-code.set';

export const LIST_REQUEST_START = 'list.request.start';
export const LIST_REQUEST_ENDSUCCESS = 'list.request.end-success';
export const LIST_REQUEST_ENDFAILURE = 'list.request.end-failure';

export const enter = LIST_ENTER;
export const leave = LIST_LEAVE;

export default ReducerFabric.make(
    code,
    {
        ready: false,
        loading: false,
        data: {},
        meta: {},
        httpCode: null,
    },
    {
        [LIST_ENTER]: state => ({ ...state, ready: true }),
        [LIST_META_SET]: (state, payload) => ({ ...state, meta: payload }),
        [LIST_HTTPCODE_SET]: (state, payload) => ({ ...state, httpCode: payload }),
        [LIST_LEAVE]: () => ({
            ready: false,
            loading: false,
            data: {},
            meta: {},
            httpCode: null,
        }),

        [LIST_REQUEST_START]: state => ({ ...state, loading: true, error: null, data: {} }),
        [LIST_REQUEST_ENDSUCCESS]: (state, payload) => ({ ...state, loading: false, error: null, data: payload }),
        [LIST_REQUEST_ENDFAILURE]: (state, payload) => ({ ...state, loading: false, error: payload, data: {} }),
    }
);
