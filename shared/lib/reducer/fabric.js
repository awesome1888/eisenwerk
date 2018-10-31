export default class ReducerFabric {
    static make(root, initialState = {}, actions = {}) {
        const r = (state, action) => {
            if (actions[action.type]) {
                return actions[action.type](state, action.payload);
            } else {
                return initialState;
            }
        };
        r.__root = root;

        return r;
    }
}
