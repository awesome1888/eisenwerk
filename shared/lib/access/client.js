import AccessBoth from './both.js';

export default class Access extends AccessBoth {
    static testRoute(user, rule) {
        if (rule.deny === true) {
            return false;
        }

        return this.testUser(user, rule);
    }
}
