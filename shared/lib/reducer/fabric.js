export default class ReducerFabric {
    static make(root, initialState = {}, actions = {}) {
        const r = (state = initialState, action) => {
            if (actions[action.type]) {
                return actions[action.type](state, action.payload);
            } else {
                return state;
            }
        };
        r.__root = root;

        return r;
    }

    static makePage(root, initialState = {}, actions = {}) {
        const pageInitial = {
            ready: false,
            loading: false,
            data: {},
            meta: {},
            httpCode: null,
        };

        const initialStateMixed = _.cloneDeep(initialState);
        Object.assign(initialStateMixed, _.cloneDeep(pageInitial));

        actions = _.cloneDeep(actions);
        Object.assign(actions, {
            [`${root}.enter`]: state => ({ ...state, ready: true }),
            [`${root}.meta.set`]: (state, payload) => ({ ...state, meta: payload }),
            [`${root}.http-code.set`]: (state, payload) => ({ ...state, httpCode: payload }),
            [`${root}.leave`]: state => ({ ...state, ..._.deepClone(pageInitial) }),
        });

        return this.make(root, initialStateMixed, actions);
    }

    static makePageActions(code) {
        return {
            ENTER: `${code}.enter`,
            LEAVE: `${code}.leave`,
            DONE: `${code}.done`,
            META_SET: `${code}.meta.set`,
            HTTPCODE_SET: `${code}.http-code.set`,
        };
    }
}
