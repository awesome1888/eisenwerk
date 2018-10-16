import EnumFactory from '../util/enum-factory/index.js';

class RoleEnumFactory extends EnumFactory {
    constructor(items) {
        super(items || [
            {value: 'A', key: 'Administrator'},
            {value: 'C', key: 'Candidate'},
            {value: 'E', key: 'Employer'},
            {value: 'P', key: 'Pre-candidate'},
        ]);

        this.ADMINISTRATOR = 'A';
        this.CANDIDATE = 'C';
        this.EMPLOYER = 'E';
        this.PRE_CANDIDATE = 'P';
    }
}

export default new RoleEnumFactory();
