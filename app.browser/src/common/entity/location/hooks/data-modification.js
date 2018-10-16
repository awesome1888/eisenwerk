import countryEnum from './../enum/country.enum.js';

export default class DataModification {
    static async declare(hooks) {
        hooks.declare({
            before: {
                create: [
                    async (context) => {

                        const data = context.data;
                        if (_.isObjectNotEmpty(data)) {
                            const search = [];

                            if (_.isStringNotEmpty(data.cityName)) {
                                search.push(data.cityName);
                            }
                            if (_.isStringNotEmpty(data.countryCode)) {
                                search.push(countryEnum.getValueByKey(data.countryCode));
                            }

                            context.data.search = search;
                        }
                    }
                ],
                patch: [
                    async (context) => {
                        const data = context.data;
                        if (_.isObjectNotEmpty(data)) {
                            const search = [];

                            if (_.isStringNotEmpty(data.cityName)) {
                                search.push(data.cityName);
                            }
                            if (_.isStringNotEmpty(data.countryCode)) {
                                search.push(countryEnum.getValueByKey(data.countryCode));
                            }
                            context.data.search = search;
                        }
                    }
                ],
            },
        });
    }
}
