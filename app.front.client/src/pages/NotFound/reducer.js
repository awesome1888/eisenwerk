import ReducerFabric from '../../shared/lib/reducer/fabric.js';

export const code = 'notFound';
export const { ENTER, LEAVE, READY } = ReducerFabric.makePageActions(code);

export default ReducerFabric.makePage(code, {
    ready: true,
    meta: {
        title: '404',
        description: '404 - not found',
        keywords: ['not', 'found'],
    },
    httpCode: 404,
});
