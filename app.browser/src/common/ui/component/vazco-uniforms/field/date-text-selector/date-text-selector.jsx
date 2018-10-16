import React, {Component} from 'react';
import moment from 'moment';
import connectField from 'uniforms/connectField';
import wrapField from './../../config/wrap-field.jsx';
import PropTypes from 'prop-types';
import classnames from 'classnames';

class DateTextSelector extends Component {

    static propTypes = {
        pattern: PropTypes.string,
        placeholder: PropTypes.string,
    };

    // if mask if diff from this, change script
    static defaultProps = {
        pattern: 'DD.MM.YYYY',
        placeholder: 'TT.MM.JJJJ'
    };

    constructor(props) {
        super(props);
        this.state = {
            value: props.value && moment(props.value).format(props.pattern),
        };
        this.raw = ['', ''];
    }

    formatDate(date, i) {
        if (!date) {
            return date;
        }

        let formatedDate = date;
        if (this.raw[i].length < date.length) {
            const maxDigBeforeDot = date.match(/\d{3,}\./g);
            const maxDigAfterDot = date.match(/\..*\.\d{5,}/g);
            const matches = date.match(/\./gi);
            const justNumbers = date.replace(/\D/g, '');
            if (date.length > 10 || maxDigBeforeDot || maxDigAfterDot || (matches && matches.length > 2) || justNumbers.length > 8) {
                return this.raw[i];
            }
            const addSeparatorToPosition = _.map([2, 4], (val, index) => val + index);
            // adds separator, if length === addSeparatorToPosition
            if (_.contains(addSeparatorToPosition, date.length) && !(matches && matches.length >= 2)) {
                formatedDate = `${date}.`;
            }
            formatedDate = formatedDate.replace(/\.+/, '.').replace(/[^0-9.]/g, '');
        }
        this.raw[i] = formatedDate;
        return formatedDate;
    }

    render() {
        const props = this.props;
        return wrapField(({feedbackable: true, ...props}), (
            <input
                className={classnames(props.inputClassName, 'form-control', {'form-control-danger': props.error})}
                value={this.formatDate(this.state.value, 0)}
                id={props.id}
                name={props.name}
                onChange={(event) => {
                    let date = null;
                    const dateFormated = this.formatDate(event.target.value, 1);
                    if (dateFormated && (dateFormated.length === this.props.pattern.length)) {
                        const dateValue = moment(event.target.value, this.props.pattern);
                        if (dateValue.isValid()) {
                            date = dateValue.toDate();
                        }
                    }
                    if (props.onChange2) {
                        props.onChange2(date);
                    }
                    props.onChange(date);
                    this.setState({value: event.target.value});
                }}
                ref={props.inputRef}
                placeholder={this.props.placeholder}
                type="text"
            />));
    }
}

export const FieldClass = DateTextSelector;
export default connectField(DateTextSelector);
