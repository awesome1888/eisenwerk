import SimpleSchema from 'simpl-schema';
import yearEnum from '../../../../../lib/enum/year.enum.js';

export default new SimpleSchema({
    universityName: {
        type: String,
        optional: false,
        label: t('University or college'),
    },
    courseName: {
        type: String,
        optional: false,
        label: t('Degree and study field'),
    },
    start: {
        type: String,
        optional: false,
        label: t('Start date'),
        allowedValues: yearEnum.makeFromRange(2024, 2000).keys,
    },
    end: {
        type: String,
        optional: false,
        label: t('End date'),
        allowedValues: yearEnum.makeFromRange(2024, 2000).keys,
        custom() {
            // start date should be less then end date
            const isStartSet = (this.field('start').isSet && this.field('start').value !== null && this.field('start').value !== '');
            const isEndSet = (this.field('end').isSet && this.field('end').value !== null && this.field('end').value !== '');

            if ((isStartSet && isEndSet) &&
                (parseInt(this.field('start').value, 10) > parseInt(this.field('end').value, 10))
            ) {
                return 'badDatePair';
            }
            return null;
        },
    },
});
