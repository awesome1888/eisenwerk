import * as reducer from './reducer';
import saga from './saga';
import Logout from './index';

export default {
    ui: Logout,
    lazy: false,
    reducer,
    saga,
    cacheable: false,
};
