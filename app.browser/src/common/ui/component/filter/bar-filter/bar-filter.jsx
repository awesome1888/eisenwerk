import React, { Component } from 'react';
import Select from '../../util/select/select.jsx';
import BarFilterTypes from './enum/bar-filter-type.enum.js';
import SearchBox from '../search-box/search-box.jsx';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import ButtonLoader from './../../button/button.jsx';
import BarFilterModal from './../../filter/bar-filter-modal/bar-filter-modal.jsx';
import BarFilterChosen from './../../filter/bar-filter-chosen/bar-filter-chosen.jsx';
import Modal from './../../modal/modal-controller.js';
import {Gateway} from 'react-gateway';

import './style.less';

export default class BarFilter extends Component {

    static propTypes = {
        filters: PropTypes.shape({
            fields: PropTypes.shape({
                type: PropTypes.string,
                field: PropTypes.string,
                values: PropTypes.array,
                label: PropTypes.string,
                placeholder: PropTypes.string,
                controllerParameters: PropTypes.object,
                isLoading: PropTypes.bool,
                isDisabled: PropTypes.bool
            }),
            layout: PropTypes.array,
        }).isRequired,
        chosenFilters: PropTypes.object.isRequired, // eslint-disable-line
        onChange: PropTypes.func,
        onReset: PropTypes.func,
        showSeparator: PropTypes.bool,
        enableMobileVersion: PropTypes.bool,
        className: PropTypes.string,
        theme: PropTypes.string
    };

    static defaultProps = {
        filters: [],
        chosenFilters: {},
        onChange: null,
        onReset: null,
        isLoading: false,
        isDisabled: false,
        isVisible: true,
        'layout.isVisible': true,
        showSeparator: true,
        enableMobileVersion: true,
        className: true,
        theme: 'light'
    };

    constructor(props) {
        super(props);

        this.state = {
            modalSelectedCount: 0,
            filterReady: false,
        };
        this.calcModalValuesCount();
    }

    async componentWillReceiveProps() {
        await this.pumpFilterFields();

        this.setState({
            filterReady: true
        });

        this.calcModalValuesCount();
    }

    async pumpFilterFields() {
        const fields = this.getFields();

        _.each(fields, async (field) => {
            if (field.needPump) {
                await field.enum.pumpUp().then(() => {
                    field.options = field.enum.getRawEnum();
                    this.setField(field.field, field);
                });
            }
        });
    }

    calcModalValuesCount() {
        let count = 0;

        const mf = this.getModalFieldList();
        const cf = this.getChosenFilters();
        _.each(cf, (value, field) => {
            if (mf.indexOf(field) > -1) {
                count += value.length;
            }
        });

        this.setState({
            modalSelectedCount: count
        });
    }

    onChange(filter, field, chosens) {
        const values = [];

        let chosenArray = _.clone(chosens);

        if (filter.type === BarFilterTypes.RADIO) {
            chosenArray = [];
            if (chosens !== null && !_.isUndefined(chosens.value)) {
                chosenArray.push(chosens.key);
            }
        } else if (filter.type !== BarFilterTypes.CHECKBOX && filter.type !== BarFilterTypes.LIST) {
            chosenArray = [];
            if (chosens !== null && !_.isUndefined(chosens.value)) {
                chosenArray.push(chosens.value);
            }
        }

        values.push({
            field,
            value: chosenArray
        });

        if (_.isFunction(this.props.onChange)) {
            this.props.onChange(values);
        }
    }

    onMultipleChange(fieldValues) {
        const values = [];

        _.each(fieldValues, (value, field) => {
            values.push({
                field,
                value
            });
        });

        if (_.isFunction(this.props.onChange)) {
            this.props.onChange(values);
        }
    }

    onClearClick() {
        if (_.isFunction(this.props.onReset)) {
            this.props.onReset();
        }
    }

    getFields() {
        const settings = this.props.filters;
        return settings.fields || {};
    }

    getField(key) {
        const fields = this.getFields();
        return fields[key] || {};
    }

    setField(key, props) {
        this.props.filters.fields[key] = props;
    }

    getChosenFilters() {
        return _.clone(this.props.chosenFilters) || {};
    }

    getChosenFilterValue(key) {
        const cf = this.getChosenFilters();
        let value = [];
        if (!_.isUndefined(cf[key])) {
            value = _.clone(cf[key]);
        }
        return value;
    }

    isSelected(field, value) {
        const ch = this.getChosenFilterValue(field);
        return ch.indexOf(value) > -1;
    }

    resetAll() {
        // resets list fields
        const cf = this.getChosenFilters();
        const newValues = {};

        _.each(cf, (value, key) => {
            const field = this.getField(key);
            if (field.type === BarFilterTypes.LIST) {
                newValues[key] = [];
            }
        });
        this.onMultipleChange(newValues);
    }

    reset(field, value) {
        const currentValue = this.getChosenFilterValue(field);
        let newValue = [];
        if (_.isArrayNotEmpty(currentValue)) {
            const i = currentValue.indexOf(value);
            if (i > -1) {
                currentValue.splice(i, 1);
            }
            newValue = currentValue;
        }

        this.onChange(this.getField(field), field, newValue);
    }

    getTotal() {
        const total = this.props.total;
        if (Number.isNaN(total)) {
            return 0;
        } else {
            return total;
        }
    }

    getChosenValuesDisplay() {
        // only for lists, ignore search fields
        const f = this.getFields();
        let activeValues = [];

        _.each(f, (field) => {
            if (field.type !== BarFilterTypes.LIST) {
                return;
            }

            const activeOptions = _.filter(field.options, (item) => {
                item.field = field.field;
                return (this.isSelected(field.field, item.key));
            });

            activeValues = activeValues.concat(activeOptions);
        });

        return activeValues;
    }

    getModalFieldList() {
        const fields = this.props.filters.modal || [];
        return fields.map(field => field.field);
    }

    getModalFields() {
        const fields = [];
        const mf = this.getModalFieldList();

        _.each(mf, (field) => {
            const filter = this.getField(field);
            if (!_.isUndefined(filter)) {
                fields.push(filter);
            }
        });

        return fields;
    }

    getModalValues() {
        const values = {};
        const mf = this.getModalFieldList();

        _.each(mf, (field) => {
            const value = this.getChosenFilterValue(field);
            if (!_.isUndefined(value)) {
                values[field] = value;
            }
        });
        return values;
    }

    onModalChangeHandler(fieldValues) {
        Modal.close();
        this.onMultipleChange(fieldValues);
    }

    getModalParameters() {
        return {
            fields: this.getModalFields(),
            values: this.getModalValues(),
            onSubmit: this.onModalChangeHandler.bind(this)
        };
    }

    openModal() {
        const mParams = this.getModalParameters();
        Modal.open(
            <BarFilterModal
                {...mParams}
            />,
            {},
            {
                showCloseButton: false
            }
        );
    }

    renderGatewayChosen() {
        return (
            <Gateway into="filter">
                {this.renderChosenDisplay()}
            </Gateway>
        );
    }

    renderChosenDisplay() {
        if (!this.state.filterReady) {
            return null;
        }
        return (
            <div className="data-block data-block-stack">
                <BarFilterChosen
                    items={this.getChosenValuesDisplay()}
                    onReset={this.reset.bind(this)}
                    onResetAll={this.resetAll.bind(this)}
                    className={`navbar-filter__modal-block_no-border navbar-filter__modal-block_mobile ${this.getTotal() ? 'navbar-filter__modal-block_mobile-hidden' : ''}`}
                />
            </div>
        );
    }

    produceInlineGroup(fieldLayout) {
        const fields = fieldLayout.field;

        return (
            <div className={'navbar-filter__field-group navbar-filter__field-group_inline'}>
                {
                    _.map(fields, (subFieldLayout) => {
                        const field = this.getField(subFieldLayout.field || '');

                        if (!field) {
                            return ('');
                        }

                        const key = `cell_${field.field}`;

                        return (
                            <div key={key} className="navbar-filter__field navbar-filter__field_inline bar-filter__field_inline-no-padding_md">
                                {this.produceFieldController(field)}
                            </div>
                        );
                    })
                }
            </div>
        );
    }

    produceResetButton() {
        return (
            <div className="navbar-filter__field-group">
                <div className="navbar-filter__field navbar-filter__field-clear">
                    <button
                        className="button button_link navbar-filter__field-clear-button"
                        onClick={this.onClearClick.bind(this)}
                    >
                        Filter zurücksetzen
                    </button>
                </div>
            </div>
        );
    }

    /**
     * field controller fabric
     */
    produceFieldController(field) {
        let fieldController = '';
        const value = this.props.chosenFilters[field.field];
        const name = `form-${field.field}`;
        const changeHandler = this.onChange.bind(this, field, field.field);
        const parameters = field.controllerParameters || {};

        if (field.type === BarFilterTypes.BUTTON) {
            if (_.isStringNotEmpty(field.href)) {
                fieldController = (
                    <a
                        className={`button ${field.class || field.className || ''}`}
                        href={field.href}
                    >
                        {field.placeholder}
                    </a>
                );
            } else {
                const onClickInternal = () => {
                    if (field.onClick) {
                        field.onClick(field.onClickParams);
                    }
                };
                fieldController = (
                    <button
                        className={`button ${field.class || field.className || ''}`}
                        name={name}
                        onClick={onClickInternal.bind(this)}
                        disabled={field.isDisabled || field.isLoading}
                        type="button"
                    >
                        <span className={field.isLoading && 'button-text_hidden'}>
                            {field.placeholder}
                        </span>
                    </button>
                );
            }
        } else if (field.type === BarFilterTypes.BUTTON_LOADER) {
            fieldController = (
                <ButtonLoader
                    className={`button ${field.class || field.className || ''}`}
                    onClick={field.onClick}
                    type="button"
                >
                    {field.placeholder}
                </ButtonLoader>
            );
        } else if (field.type === BarFilterTypes.MODAL_OPEN) {
            fieldController = (
                <button
                    className={`button button_no-text-transform button_no-padding ${field.class || field.className || ''}`}
                    onClick={this.openModal.bind(this)}
                    type="button"
                >
                    {
                        field.icon
                        &&
                        <span className={`button__icon ${field.icon}`} />
                    }
                    {field.placeholder.replace('#NUM#', this.state.modalSelectedCount)}
                </button>
            );
        } else if (field.type === BarFilterTypes.SEARCHBOX) {
            fieldController = (
                <SearchBox
                    className={field.class || ''}
                    placeholder={field.placeholder}
                    onChange={changeHandler}
                    name={name}
                    value={value}
                    icon={field.icon}
                    theme={this.props.theme}
                />
            );
        } else if (field.type === BarFilterTypes.CUSTOM) {
            fieldController = field.content;
        } else {
            fieldController = (
                <Select
                    className={field.class || ''}
                    placeholder={field.placeholder}
                    name={name}
                    options={field.values}
                    onChange={changeHandler}
                    multiple={field.type === BarFilterTypes.CHECKBOX}
                    value={value}
                    {...parameters}
                    // transparent={parameters.transparent}
                    // dynamicPlaceholder={parameters.dynamicPlaceholder}
                />
            );
        }
        return fieldController;
    }
    /**
     * If group is not inline, it represents one cell in a filter
     */
    produceGroup(field) {
        if (!field) {
            return ('');
        }

        const key = `group_${field.field}`;
        return (
            <div key={key} className="">
                {field.label && (
                    <div className="form__label">
                        {field.label}
                    </div>
                )}
                <div className="form__control">
                    {this.produceFieldController(field)}
                </div>
            </div>
        );
    }

    renderRows(layout) {
        return (
            <div
                className={
                    classnames({
                        'navbar-filter__rows-not-separated': !this.props.showSeparator,
                        'bar-filter__padded-group': true,
                    })
                }
            >
                {
                    // render rows
                    _.map(layout, (row) => {
                        const items = row.items || [];
                        return [
                            <div key={row.id} className="rb-flex rb-flex-wrap_wrap_mobile rb-flex-align-items_end rb-group_x">
                                {
                                    // render columns
                                    _.map(items, (fieldLayout) => {
                                        let key = null;
                                        let inner = null;
                                        const cellSize = fieldLayout.size || 1;
                                        const fieldName = fieldLayout.field || '';

                                        const fieldForm = this.getField(fieldName);
                                        if (fieldForm && fieldForm.hidden) {
                                            return (<div key={fieldForm.field} />);
                                        } else if (_.isArray(fieldName)) {
                                            key = `col_${fieldName.join('-')}`;
                                            inner = this.produceInlineGroup(fieldLayout);
                                        } else if (fieldName === 'resetButton') {
                                            key = 'col_reset';
                                            inner = this.produceResetButton();
                                        } else {
                                            const field = this.getField(fieldName);

                                            if (field) {
                                                key = `col_${field.field}`;
                                                inner = this.produceGroup(field);
                                            } else {
                                                key = 'nofield';
                                                inner = '';
                                            }
                                        }

                                        return (
                                            <div key={key} className={`rb-width_${cellSize}_desktop-tablet rb-width_12_mobile`}>
                                                {inner}
                                            </div>
                                        );
                                    }
                                )}
                            </div>
                        ];
                    })
                }
            </div>
        );
    }

    render() {
        const settings = this.props.filters;
        const layout = settings.layout || [];

        const classNames = [
            'navbar-filter  layout__central-body-left hack__controls-deface',
        ];
        if (this.props.narrowContainer) {
            classNames.push('navbar_max-width');
        }
        if (_.isStringNotEmpty(this.props.className)) {
            classNames.push(this.props.className);
        }

        return (
            <div
                className={classnames(classNames)}
            >
                {
                    !this.props.avoidBarFilter && !this.props.enableMobileVersion
                    &&
                    <div className="form clearfix">
                        {this.renderRows(layout)}
                    </div>
                }
                {
                    this.renderGatewayChosen()
                }
            </div>
        );
    }
}
