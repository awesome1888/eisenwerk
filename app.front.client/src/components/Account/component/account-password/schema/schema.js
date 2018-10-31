import SimpleSchema from 'simpl-schema';

SimpleSchema.setDefaultMessages({
    messages: {
        en: {
            notSamePassword: 'The given passwords don\'t match',
        },
    },
});

export default new SimpleSchema({
    oldPassword: {
        type: String,
        optional: false,
        label: 'Current password',
    },
    password: {
        type: String,
        required: true,
        label: 'New password',
    },
    passwordRepeat: {
        type: String,
        required: true,
        custom() {
            const pass = this.field('password').value;
            const passRepeat = this.field('passwordRepeat').value;
            if (pass && passRepeat && pass !== passRepeat) {
                return 'notSamePassword';
            }
            return null;
        },
        label: 'Repeat new password',
    },
});
