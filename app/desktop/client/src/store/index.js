import BaseStore from '../common/lib/util/store.js';

import globalReducer from './reducers/global.js';
// import actionPageReducer from '../ui/page/actions/reducer.js';

export default class Store extends BaseStore {
    static getGlobalReducer() {
        return globalReducer;
    }

    static getPageReducers() {
        return [
            // actionPageReducer,
        ];
    }
}
