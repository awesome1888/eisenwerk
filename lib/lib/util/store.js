import { createStore, combineReducers } from 'redux';

export default class Store {
    static create() {
        const reducers = {
            global: this.getGlobalReducer().get(),
        };
        this.getPageReducers().forEach((reducer) => {
            reducers[reducer.getActionScope()] = reducer.get();
        });

        return createStore(combineReducers(reducers));
    }
}
