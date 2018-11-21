import ReducerFabric from '../../shared/lib/reducer/fabric.js';

export const code = 'home';

export const HOME_ENTER = 'home.enter';
export const HOME_LEAVE = 'home.leave';
export const HOME_DONE = 'home.done';
export const HOME_META_SET = 'home.meta.set';
export const HOME_HTTPCODE_SET = 'home.http-code.set';

export const HOME_REQUEST_START = 'home.request.start';
export const HOME_REQUEST_ENDSUCCESS = 'home.request.end-success';
export const HOME_REQUEST_ENDFAILURE = 'home.request.end-failure';

export const enter = HOME_ENTER;
export const leave = HOME_LEAVE;

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
        [HOME_DONE]: state => ({ ...state, ready: true }),
        [HOME_META_SET]: (state, payload) => ({ ...state, meta: payload }),
        [HOME_HTTPCODE_SET]: (state, payload) => ({ ...state, httpCode: payload }),
        [HOME_LEAVE]: () => ({
            ready: false,
            loading: false,
            data: {},
            meta: {},
            httpCode: null,
        }),

        [HOME_REQUEST_START]: state => ({ ...state, loading: true, error: null, data: {} }),
        [HOME_REQUEST_ENDSUCCESS]: (state, payload) => ({ ...state, loading: false, error: null, data: payload }),
        [HOME_REQUEST_ENDFAILURE]: (state, payload) => ({ ...state, loading: false, error: payload, data: {} }),
    }
);
