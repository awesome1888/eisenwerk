import SimpleSchema from 'simpl-schema';

SimpleSchema.setDefaultMessages({
    messages: {
        en: {
            notSameEmails: 'The given emails don\'t match',
            notSameOldEmail: 'New email can\'t be equal to the current one'
        },
    },
});

export default new SimpleSchema({
    password: {
        type: String,
        required: true,
        label: 'Current password'
    },
    emailCurrent: {
        type: String,
        optional: true,
        label: 'E-Mail-Adresse'
    },
    email: {
        type: String,
        required: true,
        regEx: SimpleSchema.RegEx.Email,
        custom() {
            const em = this.value;
            const emCurrent = this.field('emailCurrent').value;

            if (em === emCurrent) {
                return 'notSameOldEmail';
            }
            return null;
        },
        label: 'New email address',
    },
    emailRepeat: {
        type: String,
        required: true,
        regEx: SimpleSchema.RegEx.Email,
        custom() {
            const em = this.field('email').value;
            const emRepeat = this.value;

            if (em !== emRepeat) {
                return 'notSameEmails';
            }
            return null;
        },
        label: 'Repeat new email address',
    },
});
