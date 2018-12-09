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
        roleAny: [roleEnum.ADMINISTRATOR],
        // custom: (user, context) => {
        //     if (user.hasRole(roleEnum.SOME_ROLE)) {
        //         Context.putUnavoidableCondition(context, {
        //             $or: [
        //                 {_id: user.getId()},
        //                 {role: roleEnum.SOME_ROLE},
        //             ],
        //         });
        //     }
        //
        //     return true;
        // },
    };
};

const getRuleUpdate = () => {
    return {
        deny: false,
        authorized: true,
        roleAny: [roleEnum.ADMINISTRATOR],
        custom: async (user, context) => {
            const id = context.id;
            const data = context.data;

            if (id) {
                // for patching an existing entity: nobody except an administrator can change other
                // user accounts but their own
                if (!user.hasRole(roleEnum.ADMINISTRATOR)) {
                    if (id.toString() !== user.getId().toString()) {
                        Error.throw403(
                            'You are not allowed to update other users',
                        );
                    }
                }
            }

            if (_.isArrayNotEmpty(data.role)) {
                const previous = await Context.extractPrevious(
                    context,
                    this.getEntity(),
                );

                const oRole = previous.getRole();
                const nRole = data.role;
                if (!_.isEqual(nRole, oRole)) {
                    // you are not allowed to change roles in general,
                    Error.throw403('You are not allowed to change roles');
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
