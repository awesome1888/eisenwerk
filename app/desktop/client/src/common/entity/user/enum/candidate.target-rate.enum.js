import EnumFactory from './../../../lib/util/enum-factory/index.js';

class CareerPreferenceRateEnumFactory extends EnumFactory {

    constructor(items) {
        super(items || [
            {value: 'EUR 20 / hour', key: '20', display: 'EUR 20 hourly target rate'},
            {value: 'EUR 30 / hour', key: '30', display: 'EUR 30 hourly target rate'},
            {value: 'EUR 40 / hour', key: '40', display: 'EUR 40 hourly target rate'},
            {value: 'EUR 50 / hour', key: '50', display: 'EUR 50 hourly target rate'},
            {value: 'EUR 60 / hour', key: '60', display: 'EUR 60 hourly target rate'},
            {value: 'EUR 70 / hour', key: '70', display: 'EUR 70 hourly target rate'},
            {value: 'EUR 80 / hour', key: '80', display: 'EUR 80 hourly target rate'},
            {value: 'EUR 90 / hour', key: '90', display: 'EUR 90 hourly target rate'},
            {value: 'EUR 100 / hour', key: '100', display: 'EUR 100 hourly target rate'},
            {value: 'EUR 110 / hour', key: '110', display: 'EUR 110 hourly target rate'},
            {value: 'EUR 120 / hour', key: '120', display: 'EUR 120 hourly target rate'},
            {value: 'EUR 130 / hour', key: '130', display: 'EUR 130 hourly target rate'},
            {value: 'EUR 140 / hour', key: '140', display: 'EUR 140 hourly target rate'},
            {value: 'EUR 150 / hour', key: '150', display: 'EUR 150 hourly target rate'},
            {value: 'More than EUR 150 / hour', key: '>150', display: 'More than EUR 150 hourly target rate'},
        ]);
    }
}

export default new CareerPreferenceRateEnumFactory();
