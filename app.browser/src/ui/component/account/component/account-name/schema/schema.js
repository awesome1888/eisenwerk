import SimpleSchema from 'simpl-schema';

export default new SimpleSchema({
    firstName: {
        type: String,
        required: true,
        label: 'First name',
    },
    lastName: {
        type: String,
        required: true,
        label: 'Last name',
    },
    gender: {
        type: String,
        required: true,
        label: 'Salutation',
    },
});
