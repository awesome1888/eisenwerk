import Home from '../pages/Home/structure';
import List from '../pages/List/structure';
import Restricted from '../pages/Restricted/structure';
import NotFound from '../pages/NotFound/structure';

import routes from './map';

export default {
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
    notFound: {
        page: NotFound,
    },
};
