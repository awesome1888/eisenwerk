const M = superclass =>
    class File extends superclass {
        static getUId() {
            return 'file';
        }

        // ////////////////////
        // attribute URL

        /**
         * Get URL by reference
         * @return String|undefined
         */
        getURL() {
            return this.getData().url;
        }

        /**
         * Get URL by value
         * @return String
         */
        extractURL() {
            if (_.isUndefined(this.getURL())) {
                this.getData().url = '';
            }

            return _.deepClone(this.getURL());
        }

        /**
         * Set URL by reference
         * @param value
         * @return void
         */
        setURL(value) {
            this.setSrcDataAt('url', value);
        }

        /**
         * Set URL by value
         * @param value
         * @return void
         */
        putURL(value) {
            this.setURL(_.deepClone(value));
        }

        /**
         * Check if we have an attribute URL
         * @returns boolean
         */
        hasURL() {
            return _.isStringNotEmpty(this.getURL());
        }

        /**
         * Unset the attribute URL
         * @returns void
         */
        unSetURL() {
            this.unSetSrcDataAt('url');
        }
    };

export default M;
