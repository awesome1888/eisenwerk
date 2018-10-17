const schema = new Schema({
    createdAt: {
        type: Date,
    },
    updatedAt: {
        type: Date,
    },
    profile: {
        type: new Schema({
            firstName: {
                type: String,
            },
            lastName: {
                type: String,
            },
            email: {
                type: String,
                unique: true,
                required: true,
            },
            password: {
                type: String,
            },
        }, { _id: false }),
        required: true,
    },
    service: {
        type: {
            google: {
                type: Object,
            },
        },
    },
    role: {
        type: [String],
    },
    data: {
        // here goes user-specific data, depending on the roles they have
    },
    // feathers-authentication-management uses the following fields for password reset
    resetToken: {
        type: String,
    },
    verifyShortToken: {
        type: String,
    },
    resetExpires: {
        type: Date,
    },
    isVerified: {
        type: Boolean,
    },
    verifyChanges: {
        type: Object,
    },
    verifyToken: {
        type: Object,
    },
});

export default schema;
