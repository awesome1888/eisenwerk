import React, {Component} from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

export default class ButtonSelector extends Component {
    static propTypes = {
        value: PropTypes.oneOfType([
            PropTypes.array,
            PropTypes.string,
        ]),
        options: PropTypes.array,
        multiple: PropTypes.bool,
        onChange: PropTypes.func,
    };

    static defaultProps = {
        value: [],
        options: [],
        multiple: true,
        onChange: null,
    };

    constructor(props) {
        super(props);

        this.state = {
            chosen: this.calcChosen(this.props),
            isFocusedId: null
        };
    }

    componentWillReceiveProps(props) {
        this.setState({
            chosen: this.calcChosen(props),
        });
    }

    calcChosen(props) {
        const m = this.props.multiple;
        if (this.props.value) {
            return m ? props.value : [props.value];
        } else {
            return [];
        }
    }

    selectToggle(key) {
        let chosenValues = this.props.value || [];
        let stateValue = null;
        const m = this.props.multiple;

        if (m) {
            const index = _.indexOf(chosenValues, key);
            if (index !== -1) {
                chosenValues.splice(index, 1);
            } else {
                chosenValues.push(key);
            }

            chosenValues = chosenValues.filter((item) => {
                return _.isStringNotEmpty(item);
            });

            stateValue = chosenValues;
        } else {
            if (chosenValues === key) {
                chosenValues = null;
                stateValue = [];
            } else {
                chosenValues = key;
                stateValue = [key];
            }
        }

        stateValue = stateValue.filter((item) => {
            return _.isStringNotEmpty(item);
        });

        this.setState({
            chosen: stateValue,
            isFocusedId: null
        }, () => {
            if (_.isFunction(this.props.onChange)) {
                this.props.onChange(chosenValues);
            }
            if (_.isFunction(this.props.onChange2)) {
                this.props.onChange2(chosenValues, key);
            }
        });
    }

    onFocus(key) {
        this.setState({
            isFocusedId: key
        });
    }

    onBlur() {
        this.setState({
            isFocusedId: null
        });
    }

    getElement(it, index) {
        const isChosen = this.state.chosen.indexOf(it.key) > -1;
        const isFocused = this.state.isFocusedId === it.key;
        return (
            <label
                key={`${index}-${it.key}`}
                className={`form-control-giant-select_li ${this.props.buttonSize || 'width_33p'}`}
            >
                <input
                    type="checkbox"
                    onChange={this.selectToggle.bind(this, it.key)}
                    name={this.props.name}
                    value={it.key}
                    checked={isChosen}
                    onFocus={this.onFocus.bind(this, it.key)}
                    onBlur={this.onBlur.bind(this)}
                />
                <span
                    className={classnames(
                        'form-control-giant-select_span',
                        {
                            'form-control-giant-select_span__chosen': isChosen,
                            'form-control-giant-select_span__focused-black': isFocused && isChosen,
                            'form-control-giant-select_span__focused-empty': isFocused && !isChosen,
                        }
                    )}
                >
                    {it.label}
                </span>
            </label>
        );
    }

    render() {
        return (
            <div className="form-control-giant-select_container">
                <div className="form-control-giant-select">
                    {
                        this.props.options.map((it, index) => this.getElement(it, index))
                    }
                </div>
            </div>
        );
    }
}
