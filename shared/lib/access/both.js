export default class BothAccess {
    static testRoute(user, rule) {
        if (rule.deny === true) {
            return false;
        }

        return this.testUser(user, rule);
    }

    /**
     * Test the given rule against the given user
     * @param user
     * @param rule
     * @returns boolean True if the access can be granted
     */
    static testUser(user, rule) {
        if (rule.authorized === true && !_.isObjectNotEmpty(user)) {
            return false;
        }

        const userRole = _.isObjectNotEmpty(user) ? user.getRole() : [];

        if (_.isArray(rule.roleAny)) {
            // at least one role should match
            if (!_.isArrayNotEmpty(_.intersection(rule.roleAny, userRole))) {
                return false;
            }
        }

        if (_.isArray(rule.roleAll)) {
            // all roles should match
            if (_.isArrayNotEmpty(_.difference(rule.roleAll, userRole))) {
                return false;
            }
        }

        if (_.isFunction(rule.custom)) {
            return rule.custom(user, rule);
        }

        return true;
    }
}
