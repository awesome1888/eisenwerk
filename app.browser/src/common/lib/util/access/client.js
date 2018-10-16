import AccessBoth from './both.js';

export default class Access extends AccessBoth {
    static testRoute(user, rule) {
        if (rule.deny === true) {
            return false;
        }

        if (rule.authorized === true && !_.isObjectNotEmpty(user)) {
            return false;
        }

        if (!this.testUserSync(user, rule)) {
            return false;
        }

        if (_.isFunction(rule.custom)) {
            return rule.custom(user, rule);
        }

        return true;
    }
}
