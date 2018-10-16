import roleEnum from '../enum/role.js';
// import moment from 'moment';

const M = superclass => class User extends superclass {
    static getUId() {
        return 'user';
    }

    getRole() {
        return this.getData().role;
    }

    hasRole(role) {
        return _.contains(this.getRole(), role);
    }

    isAdministrator() {
        return this.hasRole(roleEnum.ADMINISTRATOR);
    }

    getProfile() {
        return this.getData().profile;
    }

    normalizeData(data) {
        data.profile = data.profile || {};
        data.role = data.role || [];

        return data;
    }

    // getCreatedAtFormatted(format = 'DD.MM.YYYY') {
    //     const date = this.getCreatedAt();
    //     if (_.isStringNotEmpty(date) || _.isDate(date)) {
    //         return moment(date).format(format);
    //     }
    //
    //     return '';
    // }
};

export default M;
