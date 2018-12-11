import Home from '../pages/Home/structure';
import Login from '../pages/Login/structure';
import List from '../pages/List/structure';
import Restricted from '../pages/Restricted/structure';
import NotFound from '../pages/NotFound/structure';
import Forbidden from '../pages/Forbidden/structure';

import routes from './map';

export default {
    login: {
        ...routes.login,
        page: Login,
    },
    home: {
        ...routes.home,
        page: Home,
    },
    list: {
        ...routes.list,
        page: List,
    },
    restricted: {
        ...routes.restricted,
        page: Restricted,
    },
    forbidden: {
        ...routes.forbidden,
        page: Forbidden,
    },
    notFound: {
        page: NotFound,
    },
};
