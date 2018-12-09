import roleEnum from '../enum/role.js';

const M = superclass =>
    class User extends superclass {
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
    };

export default M;
