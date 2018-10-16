import countryEnum from './../enum/country.enum.js';

const M = superclass => class Location extends superclass {
    static getUId() {
        return 'locations';
    }

    getCityName() {
        return this.getData().cityName;
    }

    getCountryCode() {
        return this.getData().countryCode;
    }

    getCountryDisplay() {
        const countryCode = this.getCountryCode();
        return countryEnum.getValueByKey(countryCode);
    }
};

export default M;
