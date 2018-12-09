/**
 * Returns access rights for exposing this entity over the wire. They don't get applied when working server-side.
 * @returns {{}}
 */

const allow = {
    deny: false,
    authorized: false,
};

export default {
    get: {
        deny: false,
        authorized: true,
    },
    find: allow,
    create: allow,
    update: allow,
    replace: allow,
};
