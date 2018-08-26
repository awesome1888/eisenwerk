const M = superclass => class Company extends superclass {

    static getUId() {
        return 'companies';
    }

    getName() {
        return this.getDetails().name;
    }

    getDetails() {
        return this.getData().details;
    }

    hasLogo() {
        return _.isStringNotEmpty(this.getLogoURL());
    }

    getLogoURL() {
        return this.getDetails().logoURL || '';
    }

    getEmployers() {
        return this.getData().employers || [];
    }

    getEmployerCount() {
        return this.getEmployers().length;
    }

    getCompanyCompletion() {
        return this.getData().companyCompletion || null;
    }

    normalizeData(data) {
        data.details = data.details || {};
    }
};

export default M;
