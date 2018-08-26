import SimpleSchema from 'simpl-schema';

import workExperienceEnum from '../../../../../entity/user/enum/candidate.work-experience.enum.js';
import preferredRoleEnum from '../../../../../entity/user/enum/candidate.preferred-role.enum.js';
import nrReportingEnum from '../../../../../entity/user/enum/candidate.number-reporting.enum.js';

export default new SimpleSchema({
    overall: {
        type: String,
        optional: false,
        label: 'Overall work experience',
        allowedValues: workExperienceEnum.keys,
    },
    type: {
        type: Array,
        minCount: 1,
        optional: false,
        label: 'Specialities'
    },
    'type.$': {
        type: String,
        allowedValues: preferredRoleEnum.keys,
    },
    specialities: [new SimpleSchema({
        _id: {
            type: String,
            optional: true,
        },
        key: {
            type: String,
            optional: false,
            label: 'Experience',
            allowedValues: preferredRoleEnum.keys,
        },
        experience: {
            type: String,
            optional: false,
            label: 'Experience',
            allowedValues: workExperienceEnum.keys,
        },
    })],
    nrReporting: {
        type: String,
        optional: false,
        label: 'Number of people currently reporting to you',
        allowedValues: nrReportingEnum.keys,
    },
});
