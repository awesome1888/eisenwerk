import Entity from '../../../lib/entity/client.js';
import Common from './both.js';
import locationEnum from '../../../entity/location/enum/location.enum.js';
import skillEnum from '../../../entity/skill/enum/skill.enum.js';
import companyEnum from '../../../entity/company/enum/company.enum.js';

export default class UserEntity extends mix(Entity).with(Common) {
    static getServiceName() {
        return 'users';
    }

    async populate() {
        return Promise.all([
            locationEnum.pumpUpPart(this.getLocationRefs()),
            skillEnum.pumpUpPart(this.getSkillRefs()),
            companyEnum.pumpUpPart(this.getCompanyRefs()),
        ]);
    }
}
