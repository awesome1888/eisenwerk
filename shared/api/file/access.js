/**
 * Returns access rights for exposing this entity over the wire. They don't get applied when working server-side.
 * @returns {{}}
 */

const access = {
    deny: false,
    authorized: true,
};

export default {
    get: access,
    find: access,
    create: access,
    default: {
        deny: true,
    },
};
