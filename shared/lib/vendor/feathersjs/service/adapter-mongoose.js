import Service from '../../../../vendor/feathersjs/mongoose/service';
import flatten from 'obj-flatten';
import traverse from 'traverse';

/**
 * https://docs.feathersjs.com/api/databases/common.html#extending-adapters
 */
export default class AdapterMongoose extends Service {
    async find(params) {
        // mongoose only supports flat $select, so have to make it so
        this.flattenSelect(params);
        // bypass some limitations of the base service
        this.refineRequestCondition(params);
        return super.find(params);
    }

    async get(id, params) {
        // mongoose only supports flat $select, so have to make it so
        this.flattenSelect(params);
        return super.get(id, params);
    }

    /**
     * The same as .patch(), but does nested object merge, not overwrite
     * @param id
     * @param data
     * @param params
     * @returns {*}
     */
    async patchMerge(id, data, params) {
        // flatten the data pack, to be able to "merge-in" certain sub-paths
        // this is typical behaviour we want probably have in 90% times
        if (!data.$push && !data.$pull && !data.$addToSet && !data.$unset) {
            data = flatten(data);
        }
        return super.patch(id, data, params);
    }

    flattenSelect(params) {
        const select = _.get(params, 'query.$select');
        if (_.isObjectNotEmpty(select)) {
            params.query.$select = flatten(select);
        }
    }

    /**
     * Tune the request to bypass mongoose-feathersjs limitations
     * @param params
     */
    refineRequestCondition(params) {
        traverse(params).forEach(function update(x) {
            // replaces all occurrences of {$regex: 'blah', $options: 'blah'} with new RegExp()
            if (_.isObject(x) && '$regex' in x) {
                this.update(new RegExp(x.$regex, x.$options || ''));
            }
            // make sure that $size operator receives an integer
            if (_.isObject(x) && '$size' in x) {
                const y = _.clone(x);
                y.$size = parseInt(x.$size, 10);
                this.update(y);
            }
            // resolve an agreement for an empty array as a value for $ne operator
            if (_.isObject(x) && '$ne' in x && x.$ne === '[]') {
                const y = _.clone(x);
                y.$ne = [];
                this.update(y);
            }
        });
    }
}
