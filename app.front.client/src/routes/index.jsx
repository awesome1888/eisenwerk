import Home from '../pages/Home/structure';
import List from '../pages/List/structure';
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
    notFound: {
        page: NotFound,
    },
};
