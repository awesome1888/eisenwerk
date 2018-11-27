import * as reducer from './reducer';

export default {
    ui: () => import('./index'),
    lazy: true,
    reducer,
    saga: null,
};
