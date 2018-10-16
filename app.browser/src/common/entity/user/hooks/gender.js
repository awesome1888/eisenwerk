import genderApi from './../../../vendor/gender-api/gender-api.js';

export default class GenderHook {
    static async declare(hooks) {
        hooks.declare({
            before: {
                create: [
                    async (context) => {
                        const profile = context.data.profile;
                        if (_.isObjectNotEmpty(profile)) {
                            const fullName = `${profile.firstName} ${profile.lastName}`;

                            const gender = await genderApi.getByName(fullName);
                            if (_.isStringNotEmpty(gender)) {
                                context.data.profile.gender = gender;
                            }
                        }
                    }
                ],
            },
        });
    }
}
