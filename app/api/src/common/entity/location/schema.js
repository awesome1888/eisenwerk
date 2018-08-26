const schema = {
    cityName: {
        type: String,
    },
    cityId: {
        type: String,
    },
    countryCode: {
        type: String,
    },
    cityPopulation: {
        type: Number,
        defaultValue: 0,
    },
    search: {
        type: [String],
    },
    primary: {
        type: Boolean,
        defaultValue: false,
    },
};

export default schema;
