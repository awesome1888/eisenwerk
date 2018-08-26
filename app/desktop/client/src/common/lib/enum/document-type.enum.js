import EnumFactory from '../util/enum-factory/index.js';

class DocumentTypeEnumFactory extends EnumFactory {
    constructor(items) {
        super(items || [
            {key: 'LL', valueDE: 'Lebenslauf', value: 'CV'},
            {key: 'ZS', valueDE: 'Zeugnis', value: 'Certificate'},
            {key: 'AZ', valueDE: 'Arbeitszeugnis', value: 'Reference'},
        ]);
    }
}

export default new DocumentTypeEnumFactory();
