import EnumFactory from './../../../lib/util/enum-factory/index.js';

class CareerPreferenceLocationEnumFactory extends EnumFactory {

    OTHER = 'OT';

    constructor(items) {
        super(items || [
            {value: 'Berlin', key: 'fCYKTSZqgSDvjmCpP'},
            {value: 'Cologne', key: '9NZwuKRDM9etmY3e8'},
            {value: 'Düsseldorf', key: '3xwY9soSZQHDhfFvb'},
            {value: 'Frankfurt am Main', key: '6XbEktzm5dNW6DnJZ'},
            {value: 'Hamburg', key: 'dEA62wHmSZW6kGmYS'},
            {value: 'Munich', key: 'BAa4zfufykPQs5GzM'},
            {value: 'Stuttgart', key: 'x9FuCHzxrHfJyBNgX'},
            {value: 'Other locations', key: 'OT'},
        ]);
    }
}

export default new CareerPreferenceLocationEnumFactory();
