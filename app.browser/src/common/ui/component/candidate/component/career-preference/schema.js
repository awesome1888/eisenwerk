import SimpleSchema from 'simpl-schema';

import preferredRoleEnum from '../../../../../entity/user/enum/candidate.preferred-role.enum.js';
import careerPreferenceTypeEnum from '../../../../../entity/user/enum/candidate.preference-type.enum.js';
import searchStatusEnum from '../../../../../entity/user/enum/candidate.search-status.enum.js';
import noticePeriodEnum from '../../../../../entity/user/enum/candidate.notice-period.enum.js';
import targetSalaryEnum from '../../../../../entity/user/enum/candidate.target-salary.enum.js';
import workRemoteEnum from '../../../../../entity/user/enum/candidate.work-remote.enum.js';
import preferredCompanyEnum from '../../../../../entity/user/enum/candidate.preferred-company.enum.js';
import preferredLocationEnum from '../../../../../entity/user/enum/candidate.preferred-location.enum.js';
import targetRateEnum from '../../../../../entity/user/enum/candidate.work-experience.enum.js';

function customGenerator(type) {
    return {
        custom() {
            if (_.contains(this.field('type').value, type) && !this.value) {
                return 'required';
            }
            return null;
        }
    };
}

function customPO() {
    return customGenerator(careerPreferenceTypeEnum.enums.PO);
}

function customFO() {
    return customGenerator(careerPreferenceTypeEnum.enums.FO);
}

function preferredLocationCustom(type) {
    return {
        custom() {
            if (_.contains(this.field('type').value, type)) {
                const field = this.key.replace('preferredLocation', 'workRemote');

                if (this.field(field).value !== workRemoteEnum.enums.RO && (_.isUndefined(this.value) || !this.value.length)) {
                    return 'minCount';
                }
            }
            return null;
        }
    };
}

export default new SimpleSchema({
    type: {
        type: Array,
        optional: false,
        label: 'Type',
        minCount: 1,
    },
    'type.$': {
        type: String,
        allowedValues: careerPreferenceTypeEnum.keys,
    },
    permanent: new SimpleSchema({
        searchStatus: {
            type: String,
            label: 'Job search status',
            allowedValues: searchStatusEnum.keys,
            optional: true,
            ...customPO()
        },
        noticePeriod: {
            type: String,
            optional: true,
            label: 'Notice period',
            allowedValues: noticePeriodEnum.keys,
            ...customPO()
        },
        targetSalary: {
            type: String,
            optional: true,
            label: 'Target salary (incl. bonus)',
            allowedValues: targetSalaryEnum.keys,
            ...customPO()
        },
        workRemote: {
            type: String,
            optional: true,
            label: 'Interested in working remotely',
            allowedValues: workRemoteEnum.keys,
            ...customPO()
        },
        preferredRole: {
            type: Array,
            minCount: 1,
            optional: true,
            label: 'Preferred roles',
            ...customPO()
        },
        'preferredRole.$': {
            type: String,
            allowedValues: preferredRoleEnum.keys,
        },
        preferredCompany: {
            type: Array,
            minCount: 1,
            optional: true,
            label: 'Preferred companies',
            ...customPO()
        },
        'preferredCompany.$': {
            type: String,
            allowedValues: preferredCompanyEnum.keys,
        },
        preferredLocation: {
            type: Array,
            optional: true,
            label: 'Preferred locations',
            ...preferredLocationCustom(careerPreferenceTypeEnum.enums.PO)
        },
        'preferredLocation.$': {
            type: String,
            allowedValues: preferredLocationEnum.keys,
        },
        otherLocation: {
            type: Array,
            optional: true,
            label: 'Other locations'
        },
        'otherLocation.$': {
            type: String,
        },
    }),
    freelancer: new SimpleSchema({
        targetRate: {
            type: String,
            optional: true,
            label: 'Target rate',
            allowedValues: targetRateEnum.keys,
            ...customFO()
        },
        workRemote: {
            type: String,
            optional: true,
            label: 'Interested in working remotely',
            allowedValues: workRemoteEnum.keys,
            ...customFO()
        },
        preferredRole: {
            type: Array,
            minCount: 1,
            optional: true,
            label: 'Preferred freelance roles',
            ...customFO()
        },
        'preferredRole.$': {
            type: String,
            allowedValues: preferredRoleEnum.keys,
        },
        preferredCompany: {
            type: Array,
            minCount: 1,
            optional: true,
            label: 'Preferred companies',
            ...customFO()
        },
        'preferredCompany.$': {
            type: String,
            allowedValues: preferredCompanyEnum.keys,
        },
        preferredLocation: {
            type: Array,
            // minCount: 1,
            optional: true,
            label: 'Preferred locations',
            ...preferredLocationCustom(careerPreferenceTypeEnum.enums.FO)
        },
        'preferredLocation.$': {
            type: String,
            allowedValues: preferredLocationEnum.keys,
        },
        otherLocation: {
            type: Array,
            optional: true,
            label: 'Other locations'
        },
        'otherLocation.$': {
            type: String,
        },
    }),
});
