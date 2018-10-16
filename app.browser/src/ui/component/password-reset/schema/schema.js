import SimpleSchema from 'simpl-schema';

export default new SimpleSchema({
    password: {
        type: String,
        optional: false,
        label: 'New password',
    },
    passwordConfirm: {
        type: String,
        label: 'Repeat new password',
        optional: false,
        custom() {
            if (this.siblingField('password').value !== this.value) {
                return 'notSamePassword';
            }

            return null;
        }
    },
});
