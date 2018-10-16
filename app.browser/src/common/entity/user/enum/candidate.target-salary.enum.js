import EnumFactory from './../../../lib/util/enum-factory/index.js';

class CareerPreferenceSalaryEnumFactory extends EnumFactory {

    constructor(items) {
        super(items || [
            {value: 'EUR 40,000 / year', key: '40k', display: 'EUR 40,000 yearly target salary (incl. bonus)'},
            {value: 'EUR 50,000 / year', key: '50k', display: 'EUR 50,000 yearly target salary (incl. bonus)'},
            {value: 'EUR 60,000 / year', key: '60k', display: 'EUR 60,000 yearly target salary (incl. bonus)'},
            {value: 'EUR 70,000 / year', key: '70k', display: 'EUR 70,000 yearly target salary (incl. bonus)'},
            {value: 'EUR 80,000 / year', key: '80k', display: 'EUR 80,000 yearly target salary (incl. bonus)'},
            {value: 'EUR 90,000 / year', key: '90k', display: 'EUR 90,000 yearly target salary (incl. bonus)'},
            {value: 'EUR 100,000 / year', key: '100k', display: 'EUR 100,000 yearly target salary (incl. bonus)'},
            {value: 'EUR 110,000 / year', key: '110k', display: 'EUR 110,000 yearly target salary (incl. bonus)'},
            {value: 'EUR 120,000 / year', key: '120k', display: 'EUR 120,000 yearly target salary (incl. bonus)'},
            {value: 'EUR 130,000 / year', key: '130k', display: 'EUR 130,000 yearly target salary (incl. bonus)'},
            {value: 'EUR 140,000 / year', key: '140k', display: 'EUR 140,000 yearly target salary (incl. bonus)'},
            {value: 'EUR 150,000 / year', key: '150k', display: 'EUR 150,000 yearly target salary (incl. bonus)'},
            {value: 'More than EUR 150,000 / year', key: '>150k', display: 'More than EUR 150,000 yearly target salary (incl. bonus)'},
        ]);
    }
}

export default new CareerPreferenceSalaryEnumFactory();
