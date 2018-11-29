import ReducerFabric from '../../shared/lib/reducer/fabric.js';

export const mountPoint = 'notFound';
export const { ENTER, LEAVE, READY } = ReducerFabric.makePageActions(
    mountPoint,
);

export default ReducerFabric.makePageReducer(mountPoint, {
    ready: true,
    meta: {
        title: '404',
        description: '404 - not found',
        keywords: ['not', 'found'],
    },
    httpCode: 404,
});
