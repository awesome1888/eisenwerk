export default class Model {
    /**
     * Make local simple form model from the external complex data source
     * make use of it inside the form
     * @param data
     * @param props
     * @returns {*}
     */
    static makeSubModel(data) {
        if (data) {
            return _.deepClone(data);
        }
        return {};
    }

    /**
     * Merge local form model back to the external data source
     * @param model
     * @param target
     * @param props
     */
    static applySubModelToSource(model, target) {
        if (!_.isObject(target)) {
            return;
        }

        Object.assign(target, model);
    }

    /**
     * Make additional amends inside the local form model
     * @param model
     * @param props
     */
    static updateSubModel() {
    }

    static uglify(value) {
        if (_.isArrayNotEmpty(value)) {
            return value.map((item) => {
                return {
                    text: item,
                };
            });
        }

        return value;
    }

    static deUglify(value) {
        return _.pluck(value, 'text');
    }
}
