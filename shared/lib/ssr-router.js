import pathMatch from 'path-match';

const pmRoute = pathMatch({
    sensitive: false,
    strict: false,
    end: false,
});

export default class SSRRouter {
    static match(url = '/', routes = {}) {
        let route = null;
        const match = {};

        if (_.isObjectNotEmpty(routes)) {
            // todo: support redirects here

            routes = Object.values(routes);
            for (let k = 0; k < routes.length; k++) {
                const routeTest = routes[k];
                if (routeTest.exact) {
                    if (routeTest.path === url) {
                        route = routeTest;
                        match.exact = true;
                        break;
                    }
                } else {
                    const result = pmRoute(routeTest.path)(url);
                    if (result) {
                        route = routeTest;
                        match.params = result;
                        break;
                    }
                }
            }
        }

        if (route) {
            match.params = match.params || {};
            match.path = route.path;
            match.url = url;
        }

        return { route, match };
    }
}
