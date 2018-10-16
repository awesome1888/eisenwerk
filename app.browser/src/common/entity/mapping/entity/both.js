const M = superclass => class Mapping extends superclass {
    static getUId() {
        return 'mapping';
    }
};

export default M;
