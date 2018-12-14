import * as reducer from './reducer';
import saga from './saga';

export default {
    ui: () => import('./index'),
    lazy: true,
    reducer,
    saga,
    cacheable: false,
};
