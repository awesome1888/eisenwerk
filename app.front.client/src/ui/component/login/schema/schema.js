import SimpleSchema from 'simpl-schema';

export default new SimpleSchema({
    email: {
        type: String,
        optional: false,
        regEx: SimpleSchema.RegEx.Email,
        label: 'E-Mail',
    },
    password: {
        type: String,
        optional: false,
        label: 'Password',
    },
});
