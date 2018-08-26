import EnumFactoryDB from '../../../lib/util/enum-factory/enum-factory-db.js';
import Company from './../entity/client.js';

class CompanyEnumFactory extends EnumFactoryDB {

    getEntity() {
        return Company;
    }

    getValueField() {
        return 'details.name';
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

    prepareItem(item) {
        let name = 'Untitled';

        if (item._data) {
            item = item.getData();
        }

        if (_.isObjectNotEmpty(item.details) && _.isStringNotEmpty(item.details.name)) {
            name = item.details.name;
        }

        return {
            key: item._id,
            value: name,
        };
    }
}

export default new CompanyEnumFactory();
