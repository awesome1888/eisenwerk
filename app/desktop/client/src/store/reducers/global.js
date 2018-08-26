import BaseReducer from '../../common/lib/util/reducer.js';

export default class Reducer extends BaseReducer {

    static getInitialState() {
        return {
            user: {},
            ready: false,
        };
    }

    static declare() {
        return {
            'user.set': (state, payload) => {
                return {
                    ...state,
                    user: payload,
                };
            },
            'ready.set': (state, payload) => {
                return {
                    ...state,
                    ready: !!payload,
                };
            }
        };
    }
}
