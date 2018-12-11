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
    list: {
        path: '/list/:category/:topic/:way',
        redirectNotAuthorized: '/login',
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
