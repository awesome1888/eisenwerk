import SimpleSchema from 'simpl-schema';
import Util from '../../../../../lib/util/index.js';

SimpleSchema.setDefaultMessages({
    messages: {
        en: {
            tooOld: t('Must not be before 01.01.1970'),
            tooYoung: t('You must be at least 16 years old'),
            invalidDate: t('Invalid date'),
        },
    },
});

export default new SimpleSchema({
    dateOfBirth: {
        type: Date,
        optional: true,
        custom() {
            const value = this.value;
            if (!_.isDate(value)) {
                return 'invalidDate';
            }

            // todo: this probably should be done in UTC
            const ts = value.getTime();

            if (ts < -3600000) {
                return 'tooOld';
            }
            if (Util.getAge(value) < 16) {
                return 'tooYoung';
            }

            return null;
        },
        label: 'Date of birth',
    },
    uploadedFileUrl: {
        type: String,
        optional: true,
        label: 'Profile picture',
    },
    residence: {
        type: String,
        optional: false,
        label: 'Residence (city)',
    },
    phone: {
        type: String,
        optional: false,
        regEx: Util.phoneRegExp,
        label: 'Phone number',
    }
});
