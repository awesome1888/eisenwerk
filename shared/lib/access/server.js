import AccessBoth from './both.js';
import Context from '../context';
import Error from '../error';

export default class Access extends AccessBoth {
    static async testToken(token, rule, auth, ctx) {
        const result = {};

        if (rule.deny !== false) {
            // deny was not switched off manually -> forbidden
            result.error = Promise.reject(Error.get403());
            return result;
        }

        const user = await Context.extractUser(ctx, auth);

        if (rule.authorized !== false) {
            // not specified or true, check user then

            if (!user) {
                // no valid user -> not authorized
                result.error = Promise.reject(Error.get401());
                return result;
            } else {
                if (!this.testUser(user, rule, ctx)) {
                    // the user was NOT okay -> forbidden
                    result.error = Promise.reject(Error.get403());
                    return result;
                }
            }
        }

        return true;
    }
}
