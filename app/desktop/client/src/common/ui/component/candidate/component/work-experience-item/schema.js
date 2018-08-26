import SimpleSchema from 'simpl-schema';
import monthEnum from '../../../../../lib/enum/month.enum.js';

export default new SimpleSchema({
    companyName: {
        type: String,
        optional: false,
        label: t('Company'),
    },
    occupation: {
        type: String,
        optional: false,
        label: t('Job title'),
    },
    start: {
        type: new SimpleSchema({
            month: {
                type: String,
                label: t('Month'),
            },
            year: {
                type: String,
                label: t('Year'),
            },
        }),
        optional: false,
        label: t('Start date'),
    },
    end: {
        type: new SimpleSchema({
            month: {
                type: String,
                label: t('Month'),
                optional: true,
                custom() {
                    if (!this.field('current').value) {
                        if (!this.operator) {
                            if (!this.isSet || this.value === null || this.value === '') return 'required';
                        } else if (this.isSet) {
                            if (this.operator === '$set' && (this.value === null || this.value === '')) return 'required';
                            if (this.operator === '$unset') return 'required';
                            if (this.operator === '$rename') return 'required';
                        }
                    }
                    return null;
                },
            },
            year: {
                type: String,
                label: t('Year'),
                optional: true,
                custom() {
                    if (!this.field('current').value) {
                        if (!this.operator) {
                            if (!this.isSet || this.value === null || this.value === '') return 'required';
                        } else if (this.isSet) {
                            if (this.operator === '$set' && (this.value === null || this.value === '')) return 'required';
                            if (this.operator === '$unset') return 'required';
                            if (this.operator === '$rename') return 'required';
                        }
                    }
                    return null;
                },
            },
        }),
        optional: true,
        custom() {
            // start date should be less then end date
            const isStartMonthSet = (this.field('start').isSet && this.field('start').value.month !== null && this.field('start').value.month !== '');
            const isStartYearSet = (this.field('start').isSet && this.field('start').value.year !== null && this.field('start').value.year !== '');
            const isEndMonthSet = (this.field('end').isSet && this.field('end').value.month !== null && this.field('end').value.month !== '');
            const isEndYearSet = (this.field('end').isSet && this.field('end').value.year !== null && this.field('end').value.year !== '');

            if (isStartMonthSet && isStartYearSet && isEndMonthSet && isEndYearSet) {
                if (parseInt(this.field('end').value.year, 10) < parseInt(this.field('start').value.year, 10)) {
                    return 'badDatePair';
                } else if (this.field('end').value.year === this.field('start').value.year) {
                    const startMonth = monthEnum.getWeight(this.field('start').value.month);
                    const endMonth = monthEnum.getWeight(this.field('end').value.month);
                    if (startMonth > endMonth) {
                        return 'badDatePair';
                    }
                }
            }
            return null;
        },
        label: t('End date'),
    },
    current: {
        type: Boolean,
        optional: true,
        label: t('I currently work here'),
    },
    description: {
        type: String,
        optional: true,
        label: t('Description (optional)')
    }
});
