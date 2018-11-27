import ReducerFabric from '../../shared/lib/reducer/fabric';

export const code = 'application';

export const ENTER = `${code}.enter`;
export const READY = `${code}.ready`;

export const AUTHORIZED_SET = `${code}.authorized.set`;
export const AUTHORIZED_UNSET = `${code}.authorized.unset`;

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
