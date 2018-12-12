/**
 * Returns access rights for exposing this entity over the wire. They don't get applied when working server-side.
 * @returns {{}}
 */

import roleEnum from './enum/role';
import Context from '../../lib/context';
import Error from '../../lib/vendor/feathersjs/error';

/**
 * Any authorized user being in any of three legal roles can read data from the entity,
 * but with additional limitations for certain roles.
 * @returns {{deny: boolean, authorized: boolean, roleAny: *[], custom: (function(*, *, *=): boolean)}}
 */
const getRuleRead = () => {
    return {
        deny: false,
        authorized: true,
        custom: (user, context) => {
            // you can get only yourself if you are not an admin
            if (!user.hasRole(roleEnum.ADMINISTRATOR)) {
                Context.putUnavoidableCondition(context, {
                    _id: user.getId(),
                });
            }

            return true;
        },
    };
};

const getRuleUpdate = () => {
    return {
        deny: false,
        authorized: true,
        custom: async (user, context) => {
            const id = context.id;
            const data = context.data;

            if (!id) {
                // whom to update?
                Error.throw400();
            }

            // you can update only yourself if you are not an admin
            if (!user.hasRole(roleEnum.ADMINISTRATOR)) {
                if (id.toString() !== user.getId().toString()) {
                    Error.throw403('You are not allowed to update other users');
                }

                if ('role' in data) {
                    // in case there is a "role: key there
                    const previous = await Context.extractPrevious(
                        context,
                        this.getEntity(),
                    );

                    const oRole = previous.getRole();
                    const nRole = data.role;
                    if (!_.isEqual(nRole, oRole)) {
                        // you are not allowed to change roles of yourself, if you are not an admin
                        Error.throw403('You are not allowed to update roles');
                    }
                }
            }
        },
    };
};

export default {
    get: getRuleRead(),
    find: getRuleRead(),

    // everybody can create a new user, but see the limitations in .checkIntegrityOnCreate()
    create: {
        deny: false,
        authorized: false,
    },

    update: getRuleUpdate(),

    // we forbid PUT for this entity, it is inappropriate.
    replace: {
        deny: true,
    },

    // only admins can do other operations (like delete)
    default: {
        deny: false,
        authorized: true,
        roleAll: [roleEnum.ADMINISTRATOR],
    },
};
