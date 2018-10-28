import Service from 'feathers-mongoose';
import flatten from 'obj-flatten';
import traverse from 'traverse';
import errors from '@feathersjs/errors';
import errorHandler from 'feathers-mongoose/lib/error-handler.js';

/**
 * https://docs.feathersjs.com/api/databases/common.html#extending-adapters
 */
export default class MongooseService extends Service {

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
    patchMerge(id, data, params) {
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
            if (_.isObject(x) && ('$regex' in x)) {
                this.update(new RegExp(x.$regex, x.$options || ''));
            }
            // make sure that $size operator receives an integer
            if (_.isObject(x) && ('$size' in x)) {
                const y = _.clone(x);
                y.$size = parseInt(x.$size, 10);
                this.update(y);
            }
            // resolve an agreement for an empty array as a value for $ne operator
            if (_.isObject(x) && ('$ne' in x) && x.$ne === '[]') {
                const y = _.clone(x);
                y.$ne = [];
                this.update(y);
            }
        });
    }

    /**
     * A little patch of the underlying class is required, in order to allow extra filter merge. For the original see
     * https://github.com/feathersjs-ecosystem/feathers-mongoose/blob/master/lib/service.js
     * @param id
     * @param params
     * @returns {Promise<T>}
     * @private
     */
    _get(id, params = {}) {
        params.query = params.query || {};

        // PATCH START
        let filter = { [this.id]: id };
        if (_.isObjectNotEmpty(params.$$extraFilter)) {
            filter = _.cloneDeep(params.$$extraFilter);
            filter[this.id] = id;
        }
        // PATCH END

        const discriminator = (params.query || {})[this.discriminatorKey] || this.discriminatorKey;
        const model = this.discriminators[discriminator] || this.Model;

        // PATCH START
        let modelQuery = model
          .findOne(filter);
        // PATCH END

        // Handle $populate
        if (params.query.$populate) {
            modelQuery = modelQuery.populate(params.query.$populate);
        }

        // Handle $select
        if (params.query.$select && params.query.$select.length) {
            let fields = { [this.id]: 1 };

            for (let key of params.query.$select) {
                fields[key] = 1;
            }

            modelQuery.select(fields);
        } else if (params.query.$select && typeof params.query.$select === 'object') {
            modelQuery.select(params.query.$select);
        }

        return modelQuery
          .lean(this.lean)
          .exec()
          .then(data => {
              if (!data) {
                  throw new errors.NotFound(`No record found for id '${id}'`);
              }

              return data;
          })
          .catch(errorHandler);
    }
}
