const schema = {
    createdAt: {
        type: Date,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    value: {
        type: String,
        required: true,
    },
    candidateId: {
        type: TObjectId,
        ref: 'users',
        required: true,
    },
};

export default schema;
