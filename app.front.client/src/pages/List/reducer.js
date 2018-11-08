import ReducerFabric from '../../shared/lib/reducer/fabric.js';

export const LIST_REQUEST_START = 'list.request.start';
export const LIST_REQUEST_ENDSUCCESS = 'list.request.end-success';
export const LIST_REQUEST_ENDFAILURE = 'list.request.end-failure';

export default ReducerFabric.make(
    'list',
    {
        loading: false,
        data: {},
    },
    {
        [LIST_REQUEST_START]: state => ({ ...state, loading: true, error: null, data: {} }),
        [LIST_REQUEST_ENDSUCCESS]: (state, payload) => ({ ...state, loading: false, error: null, data: payload }),
        [LIST_REQUEST_ENDFAILURE]: (state, payload) => ({ ...state, loading: false, error: payload, data: {} }),
    }
);
