const M = superclass =>
    class File extends superclass {
        static getUId() {
            return 'article';
        }
    };

export default M;
