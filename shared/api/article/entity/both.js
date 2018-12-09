const M = superclass =>
    class ArticleEntity extends superclass {
        static getUId() {
            return 'article';
        }
    };

export default M;
