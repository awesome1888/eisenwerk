import EnumFactory from './../../../lib/util/enum-factory/index.js';

class MappingTypeEnumFactory extends EnumFactory {
    constructor(items) {
        super(items || [
            {value: 'Cities', valueDE: 'Cities', key: 'location'},
            {value: 'Skills', valueDE: 'Skills', key: 'skill'},
        ]);

        this.SKILL = 'skill';
        this.LOCATION = 'location';
    }

    getLinks() {
        return this.items.map(it => ({
            value: it[this._getValueFieldName()],
            key: it.key
        }));
    }
}

export default new MappingTypeEnumFactory();
