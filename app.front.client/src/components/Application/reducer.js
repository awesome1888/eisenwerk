import ReducerFabric from '../../shared/lib/reducer/fabric.js';

export const APPLICATION_AUTHORIZED_SET = 'application.authorized.set';
export const APPLICATION_AUTHORIZED_UNSET = 'application.authorized.unset';
export const APPLICATION_READY_SET = 'application.ready.set';

export default ReducerFabric.make(
    'application',
    {
        ready: false,
        authorized: false,
    },
    {
        [APPLICATION_AUTHORIZED_SET]: state => ({ ...state, authorized: true }),
        [APPLICATION_AUTHORIZED_UNSET]: state => ({ ...state, authorized: false }),
        [APPLICATION_READY_SET]: state => ({ ...state, ready: true }),
    }
);
