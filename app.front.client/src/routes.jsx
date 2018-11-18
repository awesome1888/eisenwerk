import Home from './pages/Home/structure';
import List from './pages/List/structure';

export default {
    home: {
        exact: true,
        path: '/',
        page: Home,
    },
    list: {
        path: '/list/:category/:topic/:way',
        page: List,
    }
};
