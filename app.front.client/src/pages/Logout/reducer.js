import ReducerFabric from '../../shared/lib/reducer/fabric.js';

export const mountPoint = 'logout';
export const { ENTER, LEAVE } = ReducerFabric.makePageActions(mountPoint);

export default ReducerFabric.makePageReducer(mountPoint);
