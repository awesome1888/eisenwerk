import pages from './pages';

export default [
    {
        exact: true,
        path: '/',
        page: pages[0],
    },
    {
        path: '/list/:category/:topic/:way',
        page: pages[1],
    },
];
