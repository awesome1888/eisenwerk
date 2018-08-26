import Method from '../../lib/util/method/server.js';
import roleEnum from '../../lib/enum/role.js';
import Entity from './entity/server.js';

export default class UserMethod extends Method {

    static getEntity() {
        return Entity;
    }

    static getDeclaration() {
        const prefix = Entity.getUId();
        return {
            [`${prefix}.candidate.activate`]: {
                body: 'activateCandidate',
                access: {
                    deny: false,
                    authorized: true,
                    roleAny: [roleEnum.PRE_CANDIDATE, roleEnum.ADMINISTRATOR],
                    custom: (user, ctx) => {
                        const args = _.getValue(ctx, 'method.arguments');

                        if (args && args.length) {
                            if (!user.hasRole(roleEnum.ADMINISTRATOR) &&
                                !(user.hasRole(roleEnum.PRE_CANDIDATE) && user.getId().toString() === args[0])
                            ) {
                                this.throw403('You are not allowed to change roles');
                            }
                        }
                    }
                },
            },
        };
    }

    async activateCandidate(id) {
        return Entity.save(id, {
            role: [
                roleEnum.CANDIDATE
            ]
        });
    }
}
