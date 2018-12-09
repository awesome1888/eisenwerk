/**
 * Returns access rights for exposing this entity over the wire. They don't get applied when working server-side.
 * @returns {{}}
 */

const allow = {
    deny: false,
    authorized: false,
};

export default {
    get: allow,
    find: allow,
    create: allow, // todo: also alias as post
    patch: allow, // todo: also alias as update
    update: allow, // todo: also alias as put and replace
};
