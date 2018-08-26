export default class Reducer {

    static getActionScope() {
        return 'global';
    }

    static declare() {
        return {
            // 'user.set': (state, payload) => {
            //     return {
            //         ...state,
            //         user: payload.user
            //     };
            // },
        };
    }

    static get() {
        const initialState = this.getInitialState();
        const scope = this.getActionScope();

        let declaration = this.declare();
        if (_.isStringNotEmpty(scope)) {
            declaration = _.reduce(declaration, (res, item, k) => {
                res[`${scope}.${k}`] = item;
                return res;
            }, {});
        }

        return (state, action) => {
            if (_.isUndefined(state)) {
                return initialState;
            }

            const fn = declaration[action.type];
            if (_.isFunction(fn)) {
                return fn(state, action.payload);
            } else {
                return state;
            }
        };
    }

    static getInitialState() {
        return {
        };
    }
}
