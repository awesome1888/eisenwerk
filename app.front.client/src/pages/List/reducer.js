import ReducerFabric from '../../shared/lib/reducer/fabric.js';

export const code = 'list';
export const {
    ENTER,
    LEAVE,
    DONE,
    META_SET,
    HTTPCODE_SET
} = ReducerFabric.makePageActions(code);

export const REQUEST_START = `${code}.request.start`;
export const REQUEST_ENDSUCCESS = `${code}.request.end-success`;
export const REQUEST_ENDFAILURE = `${code}.request.end-failure`;

export const enter = ENTER;
export const leave = LEAVE;

// export default ReducerFabric.makePage(
//     code,
//     {},
//     {
//         [REQUEST_START]: state => ({ ...state, loading: true, error: null, data: {} }),
//         [REQUEST_ENDSUCCESS]: (state, payload) => {
//             console.dir('executed?');
//             return { ...state, loading: false, error: null, data: payload }
//         },
//         [REQUEST_ENDFAILURE]: (state, payload) => ({ ...state, loading: false, error: payload, data: {} }),
//     }
// );

export default ReducerFabric.make(
    code,
    {
        ready: false,
        loading: false,
        data: {},
        meta: {},
    },
    {
        [DONE]: state => ({ ...state, ready: true }),
        [META_SET]: (state, payload) => ({ ...state, meta: payload }),
        [REQUEST_START]: state => ({ ...state, loading: true, error: null, data: {} }),
        [REQUEST_ENDSUCCESS]: (state, payload) => ({ ...state, loading: false, error: null, data: payload }),
        [REQUEST_ENDFAILURE]: (state, payload) => ({ ...state, loading: false, error: payload, data: {} }),
    }
);
