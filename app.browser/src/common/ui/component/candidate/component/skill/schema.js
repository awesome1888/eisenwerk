import SimpleSchema from 'simpl-schema';
import skillLevelEnum from '../../../../../entity/skill/enum/skill-level.enum.js';

export default new SimpleSchema({
    skills: [new SimpleSchema({
        skill: {
            type: String,
            optional: false,
            label: 'Skill',
        },
        level: {
            type: String,
            optional: false,
            label: 'Level',
            allowedValues: skillLevelEnum.keys,
        },
    })],
});
