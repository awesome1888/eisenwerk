import Method from '../../lib/util/method/server.js';
import roleEnum from '../../lib/enum/role.js';
import Entity from './entity/server.js';
import MappingProcessor from '../mapping/util/processor/index.js';
import mappingTypeEnum from '../mapping/enum/mapping-type.js';

export default class SkillMethod extends Method {

    static getEntity() {
        return Entity;
    }

    static getDeclaration() {
        const prefix = Entity.getUId();
        return {
            [`${prefix}.map`]: {
                body: 'map',
                access: {
                    deny: false,
                    authorized: true,
                    roleAny: [roleEnum.ADMINISTRATOR],
                },
            },
            [`${prefix}.unmap`]: {
                body: 'unMap',
                access: {
                    deny: false,
                    authorized: true,
                    roleAny: [roleEnum.ADMINISTRATOR],
                },
            },
        };
    }

    getEntity() {
        return this.constructor.getEntity();
    }

    async map(from, to) {
        const proc = new MappingProcessor();
        await proc.genericMap({
            from,
            to,
            collection: Entity.getModel(),
            path: 'data.skills',
            key: 'skill',
        });
    }

    async unMap(id) {
        const proc = new MappingProcessor();
        await proc.genericUnMap({
            collection: Entity.getModel(),
            id,
            type: mappingTypeEnum.SKILL,
            path: 'data.skills',
            key: 'skill',
            fieldName: 'skill',
        });
    }
}
