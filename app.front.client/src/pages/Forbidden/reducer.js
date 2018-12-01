import ReducerFabric from '../../shared/lib/reducer/fabric.js';

export const mountPoint = 'forbidden';
export const { ENTER, LEAVE, READY } = ReducerFabric.makePageActions(
    mountPoint,
);

export default ReducerFabric.makePageReducer(mountPoint, {
    ready: true,
    meta: {
        title: '403',
        description: '403 - forbidden',
        keywords: ['for', 'bidden'],
    },
    httpCode: 403,
});
