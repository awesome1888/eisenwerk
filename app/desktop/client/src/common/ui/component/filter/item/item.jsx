import { Component } from 'react';

/**
 * Base class for item element
 * @abstract
 */
export default class Item extends Component {
    /**
     * Returns true if the current item requires a bottom separator
     * @returns {boolean}
     */
    isSeparated() {
        return _.isObject(this.props.options) &&
            this.props.options.bottomSeparator === true;
    }

    /**
     * Returns true if the current item requires faded font color
     * @returns {boolean}
     */
    isFaded() {
        return false;
    }
}
