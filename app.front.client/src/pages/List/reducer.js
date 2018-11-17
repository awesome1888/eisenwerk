import ReducerFabric from '../../shared/lib/reducer/fabric.js';

export const code = 'list';

export const LIST_START = 'list.start';
export const LIST_FINISH = 'list.finish';

export const LIST_REQUEST_START = 'list.request.start';
export const LIST_REQUEST_ENDSUCCESS = 'list.request.end-success';
export const LIST_REQUEST_ENDFAILURE = 'list.request.end-failure';

export const initial = LIST_START;

export default ReducerFabric.make(
    code,
    {
        ready: false,
        loading: false,
        data: {},
    },
    {
        [LIST_FINISH]: state => ({ ...state, ready: true }),
        [LIST_REQUEST_START]: state => ({ ...state, loading: true, error: null, data: {} }),
        [LIST_REQUEST_ENDSUCCESS]: (state, payload) => ({ ...state, loading: false, error: null, data: payload }),
        [LIST_REQUEST_ENDFAILURE]: (state, payload) => ({ ...state, loading: false, error: payload, data: {} }),
    }
);
