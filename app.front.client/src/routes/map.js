export default {
    home: {
        exact: true,
        path: '/',
    },
    list: {
        path: '/list/:category/:topic/:way',
    },
    restricted: {
        path: '/restricted/:category/:topic/:way',
    },
};
