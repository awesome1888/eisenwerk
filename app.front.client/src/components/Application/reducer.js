import ReducerFabric from '../../shared/lib/reducer/fabric.js';

export const APPLICATION_START = 'application.start';
export const APPLICATION_FINISH = 'application.finish';

export const APPLICATION_AUTHORIZED_SET = 'application.authorized.set';
export const APPLICATION_AUTHORIZED_UNSET = 'application.authorized.unset';

export const initial = APPLICATION_START;

export default ReducerFabric.make(
    'application',
    {
        ready: false,
        authorized: false,
    },
    {
        [APPLICATION_FINISH]: state => ({ ...state, ready: true }),
        [APPLICATION_AUTHORIZED_SET]: state => ({ ...state, authorized: true }),
        [APPLICATION_AUTHORIZED_UNSET]: state => ({ ...state, authorized: false }),
    }
);
