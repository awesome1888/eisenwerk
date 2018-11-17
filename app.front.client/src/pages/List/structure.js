import reducer, { initial } from './reducer';
import saga from './saga';

export default {
    ui: () => import('./index'),
    lazy: true,
    reducer,
    saga,
    initial,
};
