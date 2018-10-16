export default class CompletionHook {
    static calculateCompletion(data) {
        let countFilled = 0;

        const fields = ['name', 'website', 'industries', 'employeeCount', 'missionStatement'];
        const companyDetails = data.details;

        _.each(companyDetails, (value, key) => {
            if (_.contains(fields, key) && !_.isEmpty(value)) {
                countFilled++;
            }
        });

        return (countFilled / fields.length) * 100;
    }

    static async declare(hooks) {
        hooks.declare({
            before: {
                patch: [
                    async (context) => {
                        context.data.companyCompletion = this.calculateCompletion(context.data);
                        return context;
                    }
                ],
                create: [
                    async (context) => {
                        context.data.companyCompletion = this.calculateCompletion(context.data);
                        return context;
                    }
                ],
            },
        });
    }
}
