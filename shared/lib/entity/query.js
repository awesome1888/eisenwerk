export default class Query {

    constructor(entity, parameters = {}) {
        this._entity = entity;
        this._fabric = null;
        this._parameters = {};

        // inside the constructor we choose what kind of query
        // this would be: a simple parametrized or a fabric-based
        // later, it is impossible to switch the type
        if (_.isFunction(parameters)) {
            this.setFabric(parameters);
        } else if (_.isObjectNotEmpty(parameters)) {
            this.setParameters(parameters);
        } else {
            this.setParameters();
        }
    }

    async exec() {
        const result = await this._entity.getService().find({query: this.makeQuery()});

        if (!this._parameters.lean) {
            const Entity = this._entity;
            result.data = result.data.map((item) => {
                return new Entity(item);
            });
        }

        return result;
    }

    async fetch() {
        return this.exec();
    }

    async fetchOne() {
        this.limit(1);
        const res = await this.exec();

        return res.data[0];
    }

    select(select) {
        this._parameters.select = _.isObjectNotEmpty(select) ? _.cloneDeep(select) : {};
        return this;
    }

    filter(filter) {
        this._parameters.filter = _.isObjectNotEmpty(filter) ? _.cloneDeep(filter) : {};
        return this;
    }

    sort(sort) {
        this._parameters.sort = _.isObjectNotEmpty(sort) ? _.cloneDeep(sort) : {};
        return this;
    }

    limit(limit) {
        this._parameters.limit = limit;
        return this;
    }

    offset(offset) {
        this._parameters.offset = offset;
        return this;
    }

    populate(populate) {
        this._parameters.populate = _.isObjectNotEmpty(populate) ? _.cloneDeep(populate) : {};
        return this;
    }

    lean(flag) {
        this._parameters.lean = !!flag;
    }

    clone(parameters = null) {
        const Constructor = this.constructor;
        const query = new Constructor(this._entity);
        if (this.hasFabric()) {
            // transfer the current fabric to a new query instance
            query.setFabric(this._fabric);
        }

        if (_.isObjectNotEmpty(parameters)) {
            // in case if the parameters is an object, process it through the fabric
            query.setParameters(parameters);
        } else {
            // else - just clone the existing parameters
            query.setParameters(this.getParameters());
        }

        return query;
    }

    reset() {
        this._parameters = {};
    }

    subscribe() {
        // todo
    }

    makeQuery() {
        const q = _.cloneDeep(this._parameters.filter) || {};
        if (_.isObjectNotEmpty(this._parameters.select)) {
            q.$select = _.cloneDeep(this._parameters.select);
        }
        if (_.isObjectNotEmpty(this._parameters.sort)) {
            q.$sort = _.cloneDeep(this._parameters.sort);
        }
        if (_.isNumber(this._parameters.limit)) {
            q.$limit = this._parameters.limit;
        }
        if (_.isNumber(this._parameters.offset)) {
            q.$skip = this._parameters.offset;
        }
        if (_.isArrayNotEmpty(this._parameters.populate)) {
            q.$populate = _.cloneDeep(this._parameters.populate);
        }

        return q;
    }

    getParameters() {
        return this._parameters;
    }

    setParameters(parameters) {
        this.reset();

        if (this.hasFabric()) {
            this._fabric(parameters || {}, this);
        } else if (_.isObjectNotEmpty(parameters)) {
            parameters = _.cloneDeep(parameters);

            this.filter(parameters.$filter || parameters.filter);
            this.select(parameters.$select || parameters.select);
            this.sort(parameters.$sort || parameters.sort);

            if (_.isNumber(parameters.$limit)) {
                this.limit(parameters.$limit);
            }
            if (_.isNumber(parameters.limit)) {
                this.limit(parameters.limit);
            }

            if (_.isNumber(parameters.$offset)) {
                this.offset(parameters.$offset);
            }
            if (_.isNumber(parameters.offset)) {
                this.offset(parameters.offset);
            }

            if ('$lean' in parameters) {
                this.lean(parameters.$lean);
            }
            if ('lean' in parameters) {
                this.lean(parameters.lean);
            }

            this._parameters = parameters;
        }

        return this;
    }

    setFabric(fabric) {
        if (_.isFunction(fabric)) {
            this._fabric = fabric;
        }
    }

    hasFabric() {
        return _.isFunction(this._fabric);
    }
}
