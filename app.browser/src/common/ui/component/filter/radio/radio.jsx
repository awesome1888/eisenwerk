import React from 'react';
import PropTypes from 'prop-types';

import Item from '../item/item.jsx';

export default class ItemRadioBox extends Item {

    static propTypes = {
        // This component gets the task to display through a React prop.
        // We can use propTypes to indicate it is required
        check: PropTypes.bool,
        name: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
        value: PropTypes.string.isRequired,
        handleRadioChange: PropTypes.func.isRequired,
        options: PropTypes.shape({
            bottomSeparator: PropTypes.bool,
        }),
    };

    static defaultProps = {
        check: false,
        name: '',
        label: '',
        value: '',
        handleCheckboxChange: null,
        id: ''
    };

    formid(pair1, pair2) {
        return `rd_${pair1.replace(/\s*/g, '')}_${pair2.replace(/\s*/g, '')}`;
    }

    constructor(props) {
        super(props);
        this.elemid = this.formid(props.name, props.value);
    }

    handleRadio() {
        this.props.handleRadioChange(this.props.label, this.props.value);
    }

    render() {
        return (
            <li
                className={
                    this.isSeparated()
                        ?
                        'filter-select__drop-down-item_separated_bottom'
                        :
                        ''
                }
            >
                <label htmlFor={this.elemid}>
                    <input
                        type="radio"
                        checked={this.props.check}
                        name={this.props.name}
                        value={this.props.value}
                        onChange={this.handleRadio.bind(this)}
                        id={this.elemid}
                    />
                    <span
                        className={
                            this.isFaded()
                                ?
                                'filter-select__drop-down-item_faden'
                                :
                                ''
                        }
                    >
                        {this.props.label}
                    </span>
                </label>
            </li>
        );
    }
}
