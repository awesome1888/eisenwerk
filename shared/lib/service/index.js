import Access from '../access/server.js';
import Hooks from '../util/hooks.js';
import AdapterMongoose from './adapter-mongoose';
import Error from '../util/error';
import Context from '../context';

/**
 * https://docs.feathersjs.com/api/databases/common.html#extending-adapters
 */
export default class ProxyService {

    /**
     * Returns an entity this service provides an access to
     * @returns {Entity}
     */
    static getEntity() {
        throw new Error('Not implemented: .getEntity()');
    }

    static getName() {
        return this.getEntity().getUId();
    }

    static getPath() {
        return `/${this.getName()}`;
    }

    static getDesciption() {
        return '';
    }

    static getAdapter() {
        return AdapterMongoose;
    }

    /**
     * A fabric method which creates an instance of this with the default parameters
     * @param application
     * @returns {ProxyService}
     */
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

    constructor(options) {
        const Adapter = this.getAdapter();
        this._adapterInstance = new Adapter(options);
        this._application = options.application;
    }

    /**
     * Returns an entity this service provides an access to
     * @returns {Entity}
     */
    getEntity() {
        return this.constructor.getEntity();
    }

    getAdapter() {
        return this.constructor.getAdapter();
    }

    getName() {
        return this.constructor.getName();
    }

    getPath() {
        return this.constructor.getPath();
    }

    isTimeStampEnabled() {
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
        this.attachTimeStampHooks(hooks);
        this.attachPrecedingHooks(hooks);

        // hooks for access checks. they will only work for remote calls
        this.attachSecurityHooks(hooks);

        // hooks for data consistency checks, applicable on create, update, put, remove
        this.attachIntegrityHooks(hooks);

        return hooks;
    }

    attachTimeStampHooks(hooks) {
        if (this.isTimeStampEnabled()) {
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
     */
    attachPrecedingHooks() {
    }

    /**
     * Declares security hooks
     * @param hooks
     */
    attachSecurityHooks(hooks) {
        hooks.declare({
            before: {
                all: [
                    // while executing over the wire, we check rights
                    async (context) => {
                        if (!Context.isRemote(context)) {
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
                            Error.throw403();
                        }

                        const auth = this.getAuthorization();
                        const result = await Access.testToken(Context.extractToken(context), rule, auth, context);

                        if (result === false) {
                            Error.throw403();
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

    attachIntegrityHooks(hooks) {
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
    // proxy operations, we prefer composition here

    getAdapterInstance() {
        return this._adapterInstance;
    }

    async find(params) {
        return this.getAdapterInstance().find(params);
    }

    async get(id, params) {
        return this.getAdapterInstance().get(id, params);
    }

    create(data, params) {
        return this.getAdapterInstance().create(data, params);
    }

    patch(id, data, params) {
        return this.getAdapterInstance().patchMerge(id, data, params);
    }

    update(id, data, params) {
        return this.getAdapterInstance().update(id, data, params);
    }

    remove(id, params) {
        return this.getAdapterInstance().remove(id, params);
    }

    /**
     * Returns current user by the token (if any) provided inside the context and stores the user inside
     * the context for further usage.
     * @param context
     * @returns {Promise<*>}
     */
    async getUser(context) {
        return Context.getUserByContext(context, this.getApplication().getAuthorization());
    }
}
