export default class Context {
    /**
     * Returns true if we got called over the wire
     * @param context
     * @returns {*|boolean}
     */
    static isRemote(context) {
        return _.isStringNotEmpty(_.get(context, 'params.provider'));
    }

    /**
     * Returns entity item previous data by the id (if any) provided inside the context and stores the item inside
     * the context for further usage.
     * @param context
     * @param entity
     * @returns {Promise<*>}
     */
    static async getPrevious(context, entity) {
        if (!_.isStringNotEmpty(context.id)) {
            return null;
        }

        if (!context.__previous) {
            context.__previous = await entity.get(context.id);
        }

        return context.__previous;
    }

    /**
     * Attaches an unavoidable mandatory condition to the query filter.
     * See for details:
     * https://docs.feathersjs.com/api/databases/querying.html
     * @param context
     * @param condition
     */
    static attachMandatoryCondition(context, condition) {
        const query = _.cloneDeep(context.params.query) || {};

        query.$and = query.$and || [];
        query.$and.push(condition);

        context.params.query = query;
        context.params.$$extraFilter = condition; // for "get"
    }
}
