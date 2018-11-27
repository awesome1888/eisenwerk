import ReducerFabric from '../../shared/lib/reducer/fabric.js';

export const code = 'application';

export const ENTER = 'application.enter';
export const READY = 'application.ready';

export const AUTHORIZED_SET = 'application.authorized.set';
export const AUTHORIZED_UNSET = 'application.authorized.unset';

export default ReducerFabric.make(
    code,
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
