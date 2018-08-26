import BaseModel from './model.js';
import Util from '../../../lib/util/index.js';

export default class Model extends BaseModel {

    /**
     * Make local simple form model from the external complex data source
     * make use of it inside the form
     * @param data
     * @param props
     * @returns {*}
     */
    static makeSubModel(data, props) {
        let model = {};
        if (data) {
            const items = this.extractItems(data);
            model = _.deepClone(Util.findItemByIdOrIndex(props.item, items)) || {};
        }

        // set some artificial fields
        this.updateSubModel(model);

        return model;
    }

    /**
     * Merge local form model back to the external data source
     * @param model
     * @param target
     * @param props
     */
    static applySubModelToSource(model, target, props) {
        if (!_.isObject(target)) {
            return;
        }

        model = this.makeSourceItem(model);
        const items = this.extractItems(target);
        const item = Util.findItemByIdOrIndex(props.item, items);

        if (!item) {
            items.push(model);
        } else {
            Object.assign(item, model);
        }

        this.putItems(target, items);
    }

    /**
     * Removes the exact item from the external data source (on delete)
     * @param data
     * @param props
     */
    static removeSubModelFromSource(data, props) {
        if (data) {
            const i = props.item;
            const items = this.extractItems(data);

            let index = null;
            if (Util.isId(i)) {
                // find index by id
                const item = items.find((it) => {
                    return it._id === i;
                });
                if (item) {
                    index = items.indexOf(item);
                }
            } else {
                const itemIndex = parseInt(i, 10);
                if (!Number.isNaN(itemIndex)) {
                    index = itemIndex;
                }
            }

            if (index !== null && _.isArrayNotEmpty(items) && _.isObjectNotEmpty(items[index])) {
                items.splice(index, 1);
                this.putItems(data, items);
            }
        }
    }

    /**
     * Extract the actual item set from the external data source
     * @param data
     */
    static extractItems() {
        throw new Error('Not implemented');
    }

    /**
     * Put back the actual item set back to the external data source
     * @param data
     * @param items
     */
    static putItems() {
        throw new Error('Not implemented');
    }

    static makeSourceItem(item) {
        return _.deepClone(item);
    }
}
