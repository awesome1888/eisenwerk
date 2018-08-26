import EnumFactory from './index.js';
import Util from './../index.js';

export default class EnumFactoryDB extends EnumFactory {

    constructor() {
        super(...arguments);// eslint-disable-line
        this.prepareItem = this.prepareItem.bind(this);
    }

    getEntity() {
        throw new Error('Not implemented: .getService()');
    }

    getValueField() {
        if (this._valueField) {
            return this._valueField;
        }

        throw new Error('No value field defined');
    }

    setValueField(field) {
        this._valueField = field;
    }

    getStaticMixin() {
        return null;
    }

    prepareItem(item) {
        return {
            ...item,
            key: item._id,
            value: item[this.getValueField()],
        };
    }

    getFilter() {
        return this._filter || null;
    }

    setFilter(filter) {
        this._filter = _.deepClone(filter);
        this.purge();
    }

    getSort() {
        return this._sort || null;
    }

    setSort(sort) {
        this._sort = _.deepClone(sort);
        this.purge();
    }

    mixValueField(props) {
        if (_.isUndefined(props.select)) {
            props.select = {};
        }
        props.select[this.getValueField()] = 1;
    }

    makeQuery(mixin = null) {
        const query = {
            filter: {}
        };
        const filter = _.deepClone(this.getFilter());
        if (filter) {
            query.filter = filter;
        }

        const sort = _.deepClone(this.getSort());
        if (sort) {
            query.sort = sort;
        }

        if (_.isObjectNotEmpty(mixin)) {
            Object.assign(query.filter, mixin);
        }
        this.mixValueField(query);

        const sMixin = this.getStaticMixin();
        if (sMixin) {
            Object.assign(query.filter, sMixin);
        }

        return this.getEntity().find(query);
    }

    setPumped(result) {
        this._pumped = !!result;
        this._pumping = false;
        if (_.isArrayNotEmpty(this._awaiters)) {
            this._awaiters.forEach((awaiter) => {
                if (result) {
                    awaiter.resolve();
                } else {
                    awaiter.reject();
                }
            });
        }
    }

    async pumpUp() {
        if (this._pumped) {
            return true;
        }

        if (this._pumping) {
            this._awaiters = this._awaiters || [];
            return new Promise((resolve, reject) => {
                this._awaiters.push({resolve, reject});
            });
        }

        this._pumping = true;
        return this.makeQuery()
            .then((res) => {
                const items = res.data;

                this.setItems(items.map(this.prepareItem));
                this.setPumped(true);
            })
            .catch((e) => {
                console.error(e);
            });
    }

    async pumpUpPart(keys) {
        if (!_.isArrayNotEmpty(keys) || this._pumped) {
            return true;
        }

        let missing = _.filter(keys, (item) => {
            return Util.isId(item);
        });
        missing = _.difference(missing, this.keys);

        if (_.isArrayNotEmpty(missing)) {
            return this.makeQuery({$and: [{_id: {$in: missing}}]})
                .then((res) => {
                    const items = res.data || [];
                    items.forEach((item) => {
                        this.items.push(this.prepareItem(item.getData()));
                    });
                    this.invalidateCache();
                })
                .catch((e) => {
                    console.error(e);

                });
        } else {
            return true;
        }
    }

    purge() {
        this.items = [];
        this._pumped = false;
        this.invalidateCache();
    }

    prepend(item) {
        this.put(item, true);
    }

    append(item) {
        this.put(item, false);
    }

    put(item, prepend = false) {
        if (_.isObjectNotEmpty(item)) {
            item = this.prepareItem(_.deepClone(item));
            item._new = true;

            if (!_.contains(this.keys, item.key)) {
                if (prepend) {
                    this.items.unshift(item);
                } else {
                    this.items.push(item);
                }
                this.invalidateCache();
            }
        }
    }

    clone() {
        return new this.constructor();
    }
}
