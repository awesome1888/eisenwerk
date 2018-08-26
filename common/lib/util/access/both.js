export default class Access {
    /**
     * Test the given rule against the given user
     * @param user
     * @param rule
     * @param ctx The request context, only available server-side
     * @returns boolean True if the access can be granted
     */
    static async testUser(user, rule, ctx = null) {
        return this.testUserAny(user, rule, ctx);
    }

    static testUserSync(user, rule, ctx = null) {
        return this.testUserAny(user, rule, ctx);
    }

    static testUserAny(user, rule, ctx = null) {
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

        return true;
    }
}
