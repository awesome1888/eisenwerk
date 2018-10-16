const M = superclass => class Skill extends superclass {
    static getUId() {
        return 'skills';
    }

    getSkillName() {
        return this.getData().skill;
    }
};

export default M;
