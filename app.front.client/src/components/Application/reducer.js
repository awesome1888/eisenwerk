import ReducerFabric from '../../shared/lib/reducer/fabric';

export const mountPoint = 'application';

export const ENTER = `${mountPoint}.enter`;
export const READY = `${mountPoint}.ready`;

export const AUTHORIZED_SET = `${mountPoint}.authorized.set`;
export const AUTHORIZED_UNSET = `${mountPoint}.authorized.unset`;

export default ReducerFabric.makeReducer(
    mountPoint,
    {
        ready: false,
        authorized: false,
    },
    {
        [READY]: state => ({ ...state, ready: true }),
        [AUTHORIZED_SET]: state => ({ ...state, authorized: true }),
        [AUTHORIZED_UNSET]: state => ({ ...state, authorized: false }),
    },
);
