export default class ReducerFabric {
    static makeReducer(mountPoint, initialState = {}, actions = {}) {
        const r = (state = initialState, action) => {
            if (actions[action.type]) {
                return actions[action.type](state, action.payload);
            } else {
                return state;
            }
        };
        r.mountPoint = mountPoint;

        return r;
    }

    static makePageReducer(mountPoint, initialState = {}, actions = {}) {
        const pageInitial = {
            ready: false, // indicates that the loading process is finished
            loading: false, // indicates that the page is still loading
            meta: {}, // contains page meta, like title and other SEO stuff
            httpCode: null, // contains an HTTP status, i.e. 200, 400, 500
        };

        if ('ready' in initialState) {
            pageInitial.ready = initialState.ready;
        }
        if ('meta' in initialState) {
            pageInitial.meta = _.cloneDeep(initialState.meta);
        }
        if ('httpCode' in initialState) {
            pageInitial.httpCode = initialState.httpCode;
        }

        const initialStateMixed = _.cloneDeep(initialState);
        Object.assign(initialStateMixed, _.cloneDeep(pageInitial));

        actions = _.cloneDeep(actions);
        Object.assign(actions, {
            [`${mountPoint}.enter`]: state => ({ ...state, loading: true }),
            [`${mountPoint}.meta.set`]: (state, payload) => ({
                ...state,
                meta: payload,
            }),
            [`${mountPoint}.http-code.set`]: (state, payload) => ({
                ...state,
                httpCode: payload,
            }),
            [`${mountPoint}.ready`]: state => ({
                ...state,
                ready: true,
                loading: false,
            }),
            [`${mountPoint}.leave`]: state => ({
                ...state,
                ..._.cloneDeep(pageInitial),
            }),
        });

        return this.makeReducer(mountPoint, initialStateMixed, actions);
    }

    static makePageActions(code) {
        return {
            ENTER: `${code}.enter`,
            META_SET: `${code}.meta.set`,
            HTTPCODE_SET: `${code}.http-code.set`,
            READY: `${code}.ready`,
            LEAVE: `${code}.leave`,
        };
    }
}
