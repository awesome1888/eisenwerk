import {Service as BaseService} from 'feathers-mongoose';
import flatten from 'obj-flatten';
import traverse from 'traverse';
import Access from '../../util/access/server.js';
import Hooks from '../../util/hooks.js';

import errors from '@feathersjs/errors';
import errorHandler from 'feathers-mongoose/lib/error-handler.js';

/**
 * https://docs.feathersjs.com/api/databases/common.html#extending-adapters
 */
export default class Service extends BaseService {

    /**
     * Returns an entity this service provides an access to
     * @returns {Entity}
     */
    static getEntity() {
        throw new Error('Not implemented: .getEntity()');
    }

    static make(application) {
        return new this({
            Model: this.getEntity().getModel(),
            paginate: {
                default: 5,
                max: 50,
            },
            lean: true,

            application,
        });
    }

    constructor(params) {
        super(params);
        this._application = params.application;
    }

    /**
     * Returns an entity this service provides an access to
     * @returns {Entity}
     */
    getEntity() {
        return this.constructor.getEntity();
    }

    getName() {
        return this.getEntity().getUId();
    }

    getPath() {
        return `/${this.getName()}`;
    }

    allowTimestamps() {
        return false;
    }

    /**
     * Returns access rights for exposing this entity over the wire. They don't get applied when working server-side.
     * By default - everything is denied.
     * @returns {{}}
     */
    getCRUDAccessRules() {
        return {
            default: {
                deny: true,
            },
        };
    }

    /**
     * Returns integrity checkers (functions) for each operation: create, update, patch, delete. These functions get
     * executed every time, regardless over the wire you make your call or not. So by implementing the function you
     * may control the integrity of your data: prevent some fields from changing by certain users, etc.
     * @returns {{}}
     */
    getIntegrityCheckers() {
        return {};
    }

    /**
     * Returns the main application reference.
     * @returns {*}
     */
    getApplication() {
        return this._application;
    }

    /**
     * Just a short-cut.
     * @returns {*}
     */
    getAuthorization() {
        return this.getApplication().getAuthorization();
    }

    // ///////////////////////
    // hooks

    /**
     * Returns a hook schema for the entity
     * @returns {Hooks}
     */
    getHooks() {
        const hooks = new Hooks();

        // hooks to pre-modify data before it gets checked with access checks
        this.declareTimeStampHooks(hooks);
        this.declarePreProcessHooks(hooks);

        // hooks for access checks. they will only work for remote calls
        this.declareSecurityHooks(hooks);

        // hooks for data consistency checks
        this.declareIntegrityHooks(hooks);

        return hooks;
    }

    declareTimeStampHooks(hooks) {
        if (this.allowTimestamps()) {
            hooks.declare({
                before: {
                    // on create we define createdAt
                    create: [
                        (context) => {
                            if (!_.isExist(context.data.createdAt)) {
                                context.data.createdAt = new Date();
                            }
                        }
                    ],
                    update: [
                        // on update we define updatedAt
                        (context) => {
                            if (!_.isExist(context.data.updatedAt)) {
                                context.data.updatedAt = new Date();
                            }
                        }
                    ],
                    patch: [
                        // on update we define updatedAt
                        (context) => {
                            if (!_.isExist(context.data.updatedAt)) {
                                context.data.updatedAt = new Date();
                            }
                        }
                    ],
                },
            });
        }
    }

    /**
     * Declares hooks which will be executed before security checks.
     * @param hooks
     */
    declarePreProcessHooks(hooks) {
    }

    /**
     * Declares security hooks
     * @param hooks
     */
    declareSecurityHooks(hooks) {
        hooks.declare({
            before: {
                all: [
                    // while executing over the wire, we check rights
                    async (context) => {
                        if (!this.isRemote(context)) {
                            return context;
                        }

                        const method = context.method;
                        const rules = this.getCRUDAccessRules();

                        let rule = null;
                        if (_.isObjectNotEmpty(rules[method])) {
                            rule = rules[method];
                        } else if (_.isObjectNotEmpty(rules.default)) {
                            rule = rules.default;
                        }

                        if (!_.isObjectNotEmpty(rule) || !('deny' in rule)) {
                            // no rule specified or was not explicitly allowed -> deny
                            this.throw403();
                        }

                        const auth = this.getAuthorization();
                        const result = await Access.testToken(auth.extractToken(context), rule, auth, context);

                        if (result === false) {
                            this.throw403();
                        }

                        if (_.isObjectNotEmpty(result) && result.error) {
                            return result.error;
                        }

                        return context;
                    }
                ],
            },
        });
    }

    declareIntegrityHooks(hooks) {
        hooks.declare({
            before: {
                all: [
                    async (context) => {
                        const method = context.method;
                        if (method === 'create' || method === 'update' || method === 'patch' || method === 'remove') {
                            const checkers = this.getIntegrityCheckers();

                            let checker = null;
                            if (_.isObjectNotEmpty(checkers) && _.isFunction(checkers[method])) {
                                checker = checkers[method];
                            }

                            if (checker) {
                                if (method === 'create') {
                                    await checker(context.data, context);
                                }
                                if (method === 'update' || method === 'patch') {
                                    await checker(context.id, context.data, context);
                                }
                                if (method === 'remove') {
                                    await checker(context.id, context);
                                }
                            }
                        }

                        return context;
                    }
                ],
            },
        });
    }

    // ///////////////////////
    // operation overrides

    async find(params) {
        // mongoose only supports flat $select, so have to make it so
        this.flattenSelect(params);

        // mongoose cant tolerate {$regex: 'blah', $options: 'blah'}, no idea why *rolling_eyes*
        this.replaceRegex(params);

        return super.find(params);
    }

    async get(id, params) {
        // mongoose only supports flat $select, so have to make it so
        this.flattenSelect(params);
        return super.get(id, params);
    }

    // create(data, params) {
    //     // do something cool here
    //     return super.create(data, params);
    // }

    patch(id, data, params) {
        // flatten the data pack, to be able to "merge-in" certain sub-paths
        // this is typical behaviour we want probably have in 90% times, but...
        // todo: make the following behaviour switchable off
        if (!data.$push && !data.$pull && !data.$addToSet && !data.$unset) {
            data = flatten(data);
        }
        return super.patch(id, data, params);
    }

    // update(id, data, params) {
    //     // do something cool here
    //     return super.update(id, data, params);
    // }
    //
    // remove(id, params) {
    //     // do something cool here
    //     return super.remove(id, params);
    // }

    // ///////////////////////
    // util

    flattenSelect(params) {
        const select = _.getValue(params, 'query.$select');
        if (_.isObjectNotEmpty(select)) {
            params.query.$select = flatten(select);
        }
    }

    /**
     * Replaces all occurrences of {$regex: 'blah', $options: 'blah'} with new RegExp(), because
     * of mongoose`s internal affairs
     * @param params
     */
    replaceRegex(params) {
        traverse(params).forEach(function update(x) {
            if (_.isObject(x) && ('$regex' in x)) {
                this.update(new RegExp(x.$regex, x.$options || ''));
            }
        });
    }

    /**
     * Attaches an unavoidable mandatory condition to the query filter.
     * See for details:
     * https://docs.feathersjs.com/api/databases/querying.html
     * @param context
     * @param condition
     */
    attachMandatoryCondition(context, condition) {
        const query = _.deepClone(context.params.query) || {};

        query.$and = query.$and || [];
        query.$and.push(condition);

        context.params.query = query;
        context.params.$$extraFilter = condition; // for "get"
    }

    /**
     * Returns true if we got called over the wire
     * @param context
     * @returns {*|boolean}
     */
    isRemote(context) {
        return _.isStringNotEmpty(_.getValue(context, 'params.provider'));
    }

    /**
     * Returns current user by the token (if any) provided inside the context and stores the user inside
     * the context for further usage.
     * @param context
     * @returns {Promise<*>}
     */
    async getUser(context) {
        return this.getApplication().getAuthorization().getUserByContext(context);
    }

    /**
     * Returns entity item previous data by the id (if any) provided inside the context and stores the item inside
     * the context for further usage.
     * @param context
     * @returns {Promise<*>}
     */
    async getPrevious(context) {
        if (!_.isStringNotEmpty(context.id)) {
            return null;
        }

        if (!context.__previous) {
            context.__previous = await this.getEntity().get(context.id);
        }

        return context.__previous;
    }

    throw403(message = '') {
        throw new errors.Forbidden(_.isStringNotEmpty(message) ? message : 'Forbidden');
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
            filter = _.deepClone(params.$$extraFilter);
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
