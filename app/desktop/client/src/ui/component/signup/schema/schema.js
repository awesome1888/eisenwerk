import SimpleSchema from 'simpl-schema';

export default new SimpleSchema({
    firstName: {
        type: String,
        optional: false,
        label: 'Name'
    },
    lastName: {
        type: String,
        optional: false,
        label: 'Last name'
    },
    email: {
        type: String,
        optional: false,
        regEx: SimpleSchema.RegEx.Email,
        label: 'E-Mail',
    },
    password: {
        type: String,
        optional: false
    },
});
