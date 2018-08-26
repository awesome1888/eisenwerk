import EnumFactoryDB from '../../../lib/util/enum-factory/enum-factory-db.js';
import Skill from './../entity/client.js';

class SkillEnumFactory extends EnumFactoryDB {

    // OTHER = 'Other';

    getEntity() {
        return Skill;
    }

    getValueField() {
        return this._valueField || 'skill';
    }

    getStaticMixin() {
        return {
            // skill: 1,
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

        return result;
    }

    displayFromKeys(keys) {
        if (!_.isArrayNotEmpty(keys)) {
            return [];
        }

        return this.items.filter((item) => {
            return keys.indexOf(item.key) >= 0;
        }).map((item) => {
            return item.skill || '';
        });
    }

    async pumpUp() {
        // do nothing, you must be crazy to pull the entire collection client-side
    }

    async load(search, prepend = false) {
        return this.getEntity().find({
            filter: search
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

export default new SkillEnumFactory();
