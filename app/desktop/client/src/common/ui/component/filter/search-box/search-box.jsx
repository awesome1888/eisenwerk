import React, {Component} from 'react';
import PropTypes from 'prop-types';
// import Util from '../../../../lib/util.js';

export default class Select extends Component {

    static propTypes = {
        field: PropTypes.string,
        placeholder: PropTypes.string,
        onChange: PropTypes.func
    };

    static defaultProps = {
        className: '',
        field: '',
        placeholder: '',
        onChange: null,
        value: [''],
        icon: false
    };

    componentWillReceiveProps(nextProps) {
        this[`form-${this.props.field}`].value = nextProps.value && nextProps.value[0];
    }

    getValue() {
        return this[`form-${this.props.field}`].value;
    }

    onSearch(value) {
        this.props.onChange({
            label: this.props.field,
            value
        });
    }

    handleKeyPress(e) {
        if (e.key === 'Enter') {
            this.onSearch(this.getValue());
        }
    }

    needIcon() {
        return this.props.icon;
    }

    getTheme() {
        return this.props.theme || 'dark';
    }

    renderIcon() {
        return (
            <span className={`icon icon_${this.props.icon} filter-search__icon`} />
        );
    }

    render() {
        return (
            <div
                className="filter-search"
                key={`form-${this.props.field}`}
                name={this.props.name}
            >
                {
                    this.needIcon()
                    &&
                    this.renderIcon()
                }
                <input
                    className={`filter-search__input-${this.getTheme()}`}
                    ref={(c) => { this[`form-${this.props.field}`] = c; }}
                    type="textbox"
                    placeholder={this.props.placeholder}
                    onKeyPress={this.handleKeyPress.bind(this)}
                />
                {/* <a
                    className="filter-search__button"
                    onClick={this.onSearch.bind(this)}
                >
                    &nbsp;
                </a> */}
            </div>
        );
    }
}
