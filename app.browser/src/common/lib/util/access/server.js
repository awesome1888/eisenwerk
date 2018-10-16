import errors from '@feathersjs/errors';
import AccessBoth from './both.js';

export default class Access extends AccessBoth {
    static async testToken(token, rule, auth, ctx) {
        const result = {};

        if (rule.deny !== false) {
            // deny was not switched off manually -> forbidden
            result.error = Promise.reject(new errors.Forbidden('Forbidden'));
            return result;
        }

        const user = await auth.getUserByContext(ctx);

        if (rule.authorized !== false) {
            // not specified or true, check user then

            if (!user) {
                // no valid user -> not authorized
                result.error = Promise.reject(new errors.NotAuthenticated('Not Authenticated'));
                return result;
            } else {
                if (!await this.testUser(user, rule, ctx)) {
                    // the user was NOT okay -> forbidden
                    result.error = Promise.reject(new errors.Forbidden('Forbidden'));
                    return result;
                }
            }
        }

        if (_.isFunction(rule.custom)) {
            return rule.custom(user, ctx);
        }

        // all rules were okay: allow
        return true;
    }
}
