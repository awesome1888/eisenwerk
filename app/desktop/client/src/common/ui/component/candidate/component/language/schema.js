import SimpleSchema from 'simpl-schema';
import languageEnum from '../../../../../lib/enum/language.enum.js';
import languageLevelEnum from '../../../../../lib/enum/language-level.enum.js';

export default new SimpleSchema({
    language: [new SimpleSchema({
        language: {
            type: String,
            optional: false,
            label: 'Language',
            allowedValues: languageEnum.keys,
        },
        level: {
            type: String,
            optional: false,
            label: 'Level of proficiency',
            allowedValues: languageLevelEnum.keys,
        },
    })],
});
