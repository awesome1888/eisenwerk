import EnumFactory from '../../../lib/enum';

class RoleEnumFactory extends EnumFactory {
    constructor(items) {
        super(items || [
            {value: 'A', key: 'Administrator'},
            {value: 'U', key: 'Regular user'},
            {value: 'N', key: 'Un-moderated user'},
        ]);

        this.ADMINISTRATOR = 'A';
        this.USER = 'U';
        this.NEWBE = 'N';
    }
}

export default new RoleEnumFactory();
