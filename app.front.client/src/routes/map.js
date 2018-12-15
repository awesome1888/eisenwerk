export default {
    home: {
        exact: true,
        path: '/',
        redirectNotAuthorized: '/login',
    },
    login: {
        path: '/login',
        redirectAuthorized: '/',
    },
    logout: {
        path: '/logout',
        redirectNotAuthorized: '/login',
    },
    list: {
        path: '/list/:category/:topic/:way',
    },
    restricted: {
        path: '/restricted/:category/:topic/:way',
        redirectNotAuthorized: '/login',
        access: {
            authorized: true,
        },
    },
    forbidden: {
        path: '/403',
        redirectNotAuthorized: '/login',
    },
};
