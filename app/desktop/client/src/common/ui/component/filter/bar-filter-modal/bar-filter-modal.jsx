import React, { Component } from 'react';
import AccordionSelector from '../../accordion-selector/accordion-selector.jsx';
import Collapse from './../../collapse/collapse.jsx';
import PropTypes from 'prop-types';
import BarFilterChosen from './../bar-filter-chosen/bar-filter-chosen.jsx';
import PageDefault from './../../page-default/page-default.jsx';
import Modal from './../../modal/modal-controller.js';

export default class BarFilterModal extends Component {

    static propTypes = {
        values: PropTypes.object,
        fields: PropTypes.array,
        onSubmit: PropTypes.func,
    };

    static defaultProps = {
        values: {},
        fields: [],
        onSubmit: null
    };

    constructor(props) {
        super(props);
        this.state = {
            selected: this.calcSelected(props)
        };
    }

    componentWillReceiveProps(props) {
        this.setState({
            selected: this.calcSelected(props)
        });
    }

    calcSelected(props) {
        if (props.values) {
            return props.values;
        } else {
            return [];
        }
    }

    getFields() {
        return _.deepClone(this.props.fields) || [];
    }

    getValues() {
        return _.clone(this.state.selected) || {};
    }

    getValueByKey(key) {
        const values = this.getValues();
        return values[key] || [];
    }

    setValue(key, value) {
        const selected = this.getValues();

        selected[key] = value;

        this.setState({
            selected
        });
    }

    getValuesCount(key) {
        const values = this.getValues();
        if (values[key]) {
            return values[key].length;
        }
        return 0;
    }

    isSelected(key, value) {
        const v = this.getValueByKey(key);
        return v.indexOf(value) > -1;
    }

    resetAll() {
        const selected = this.getValues();

        _.each(selected, (value, field) => {
            selected[field] = [];
        });
        this.setState({
            selected
        });
    }

    reset(key, value) {
        const v = this.getValueByKey(key);

        if (v.length) {
            const i = v.indexOf(value);
            v.splice(i, 1);
        }

        this.setValue(key, v);
    }

    getChosenValuesDisplay() {
        const fields = this.getFields();
        let activeValues = [];

        _.each(fields, (field) => {
            const activeOptions = _.filter(field.options, (item) => {
                item.field = field.field;
                return (this.isSelected(field.field, item.key));
            });

            activeValues = activeValues.concat(activeOptions);
        });

        return activeValues;
    }

    onFieldChange(key, value) {
        this.setValue(key, value);
    }

    onSubmitHandle() {
        if (_.isFunction(this.props.onSubmit)) {
            this.props.onSubmit(this.getValues());
        }
    }

    onCloseHandle() {
        Modal.close();
    }
    
    getCollapseMaxHeight(options) {
        // temporary solution
        const parent = _.filter(options, (item) => { return item.parent === true; });
        const parentCount = parent.length;
        let result = 0;
        if (parentCount) {
            result = (parentCount * 37) + ((options.length - parentCount) * 35);
        } else {
            result = options.length * 37;
        }
        return result;
    }

    renderField(field) {
        const title = `${field.title} (${this.getValuesCount(field.field)})`;
        return (
            <Collapse
                key={field.field}
                title={title}
                class=""
                content={
                    <AccordionSelector
                        name={field.name}
                        options={field.options}
                        value={this.getValueByKey(field.field)}
                        multiple={field.multiple}
                        onChange={this.onFieldChange.bind(this, field.field)}
                        allowSearch={field.allowSearch}
                    />
                }
                maxHeight={this.getCollapseMaxHeight(field.options)}
            />
        );
    }

    renderFields() {
        const fields = this.getFields();
        return (
            <div>
                {
                    fields.map((el, i) => {
                        return this.renderField(el, i);
                    })
                }
            </div>
        );
    }

    renderChosenDisplay() {
        return (
            <BarFilterChosen
                items={this.getChosenValuesDisplay()}
                onReset={this.reset.bind(this)}
                onResetAll={this.resetAll.bind(this)}
            />
        );
    }

    render() {
        return (
            <PageDefault
                title={t('Choose filters')}
                subtitle={t('How would you like to refine your search?')}
            >
                <div>
                    {this.renderChosenDisplay()}
                    {this.renderFields()}
                </div>
                <div className="group_inline_x2 group_vertical_inline flex">
                    <button className="button button_back" onClick={this.onCloseHandle.bind(this)}>
                        {t('Close')}
                    </button>
                    <button className="button button_blue" onClick={this.onSubmitHandle.bind(this)}>
                        {t('Apply')}
                    </button>
                </div>
            </PageDefault>
        );
    }
}
