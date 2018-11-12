import reducer from './reducer';
import saga from './saga';

export default {
    ui: () => import('./ui'),
    lazy: true,
    reducer,
    saga,
};
