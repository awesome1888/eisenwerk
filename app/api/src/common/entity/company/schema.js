import mongoose from 'mongoose';

const schema = {
    createdAt: {
        type: Date,
    },
    updatedAt: {
        type: Date,
    },
    employers: {
        type: [TObjectId],
        ref: 'users',
    },
    details: {
        type: new Schema({
            name: {
                type: String,
                required: true,
            },
            industries: {
                type: [String],
            },
            logoURL: {
                type: String,
            },
            employeeCount: {
                type: String,
            },
            website: {
                type: String,
            },
            missionStatement: {
                type: String,
            },
        }),
        required: true,
    },
    companyCompletion: {
        type: Number,
    },
};

export default schema;
