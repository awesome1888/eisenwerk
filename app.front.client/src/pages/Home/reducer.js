import ReducerFabric from '../../shared/lib/reducer/fabric.js';

export const HOME_REQUEST_START = 'home.request.start';
export const HOME_REQUEST_ENDSUCCESS = 'home.request.end-success';
export const HOME_REQUEST_ENDFAILURE = 'home.request.end-failure';

export default ReducerFabric.make(
    'home',
    {
        loading: false,
        data: {},
    },
    {
        [HOME_REQUEST_START]: state => ({ ...state, loading: true, error: null, data: {} }),
        [HOME_REQUEST_ENDSUCCESS]: (state, action) => ({ ...state, loading: false, error: null, data: action.payload }),
        [HOME_REQUEST_ENDFAILURE]: (state, action) => ({ ...state, loading: false, error: action.error, data: {} }),
    }
);
