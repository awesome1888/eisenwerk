// import pathToRegexp from 'path-to-regexp';
import pathMatch from 'path-match';

const pmRoute = pathMatch({
    sensitive: false,
    strict: false,
    end: false,
});

export default class SSRRouter {
    static match(url = '/', routes = []) {
        let route = null;
        const match = {};

        if (_.isArrayNotEmpty(routes)) {
            for (let k = 0; k < routes.length; k++) {
                const routeTest = routes[k];

                if (routeTest.exact && routeTest.path === url) {
                    route = routeTest;
                    match.exact = true;
                    break;
                }

                const result = pmRoute(routeTest.path)(url);
                if (result) {
                    route = routeTest;
                    match.params = result;
                    break;
                }
            }
        }

        if (route) {
            match.params = match.params || {};
            match.path = route.path;
            match.url = url;
        }

        console.dir('match');
        console.dir(match);

        // [ '/list/seamonkeys/porn/live',
        //     'seamonkeys',
        //     'porn',
        //     'live',
        //     index: 0,
        //     input: '/list/seamonkeys/porn/live',
        //     // groups: undefined ]

        return route;
        // match:
        //     isExact: true
        // params:
        //     category: "seamonkey"
        //     topic: "porn"
        //     way: "live"
        // path: "/list/:category/:topic/:way"
        // url: "/list/seamonkey/porn/live"
    }
}
