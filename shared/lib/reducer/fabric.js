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
}
