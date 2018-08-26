import SimpleSchema from 'simpl-schema';
import documentTypeEnum from '../../../../../lib/enum/document-type.enum.js';

export default new SimpleSchema({
    url: {
        type: String,
        optional: false,
        label: 'URL',
    },
    type: {
        type: String,
        optional: false,
        label: t('Document type'),
        allowedValues: documentTypeEnum.keys,
    },
    name: {
        type: String,
        optional: true,
    },
    createdAt: {
        type: Date,
        optional: true,
    },
});
