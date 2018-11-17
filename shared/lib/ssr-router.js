import pathToRegexp from 'path-to-regexp';

export default class SSRRouter {
    static match(url = '/', routes = []) {
        let found = null;
        // let rData = {};

        if (_.isArrayNotEmpty(routes)) {
            for (let k = 0; k < routes.length; k++) {
                const route = routes[k];

                if (route.exact && route.path === url) {
                    found = route;
                    break;
                }

                const re = pathToRegexp(route.path);
                const match = re.exec(url);

                if (match) {
                    found = route;
                    // rData = match;
                    break;
                }
            }
        }

        return found;
        // match:
        //     isExact: true
        // params:
        //     category: "seamonkey"
        //     topic: "porn"
        //     way: "live"
        // path: "/list/:category/:topic/:way"
        // url: "/list/seamonkey/porn/live"
        // staticContext: undefined
    }
}
