import EnumFactoryDB from '../../../lib/util/enum-factory/enum-factory-db.js';
import Helper from '../helper/helper.js';
import Location from './../entity/client.js';

class LocationEnumFactory extends EnumFactoryDB {

    // OTHER = 'Other';

    getEntity() {
        return Location;
    }

    getValueField() {
        return this._valueField || 'cityName';
    }

    getStaticMixin() {
        return {
            // cityName: 1,
            // country: 1,
            // countryCode: 1,
        };
    }

    selectize() {
        const result = [];

        this.items.forEach((item) => {
            const obj = {
                label: item[this.getValueField()],
                value: item.key,
                key: item.key,
            };
            result.push(obj);
        });

        result.push({
            value: 'Other', // this.OTHER,
            key: 'Other', // this.OTHER,
            label: t('Other location'),
        });

        return result;
    }

    displayFromKeys(keys) {
        if (!_.isArrayNotEmpty(keys)) {
            return [];
        }

        return this.items.filter((item) => {
            return keys.indexOf(item.key) >= 0;
        }).map((item) => {
            return item.cityName || '';
        });
    }

    async pumpUp() {
        // do nothing, you must be crazy to pull the entire collection client-side
    }

    async load(search, prepend = false) {
        const cond = Helper.getSearchCondition(search);

        return this.getEntity().find({
            filter: {$and: cond}
        })
            .then((res) => {
                const items = res.data || [];

                if (prepend) {
                    items.inverse().forEach((item) => {
                        this.put(item.getData(), true);
                    });
                } else {
                    items.forEach((item) => {
                        this.put(item.getData());
                    });
                }
            }).catch((e) => {
                console.dir(e);

            });
    }
}

export default new LocationEnumFactory();
