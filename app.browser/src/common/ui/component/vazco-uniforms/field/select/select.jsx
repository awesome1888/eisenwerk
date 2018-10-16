import React, {Component} from 'react';
import connectField from 'uniforms/connectField';
import Select from '../../../../../ui/component/util/select/select.jsx';
import wrapField from './../../config/wrap-field.jsx';

/**
 * This is a wrapper class, to connect Select select-box to the Vazco-unforms
 */
class SelectField extends Component {
    render() {
        const props = this.props;
        return wrapField(
            ({feedbackable: true, ...props}), (
                <Select
                    name={props.name}
                    options={props.options}
                    onChange={(value) => {
                        if (props.onChange2) {
                            props.onChange2(value && value.key);
                        }

                        if (!_.isFunction(props.onChange)) {
                            console.error('onChange() is unassigned');
                            return;
                        }

                        if (props.multiple) {
                            if (value && value.length === 0) {
                                props.onChange(null);
                            } else {
                                props.onChange(value && _.pluck(value, 'key'));
                            }
                        } else {
                            if (props.returnArray) {
                                if (value && value.key) {
                                    props.onChange([value.key]);
                                } else {
                                    props.onChange(value.key);
                                }
                            } else {
                                props.onChange(value && value.key);
                            }
                        }
                    }}
                    multiple={props.multiple}
                    value={props.value}
                    id={props.id}
                    ref={props.inputRef}
                    disabled={props.disabled}
                    searchable={props.searchable}
                    className={props.className}
                    getValue={props.getValue}
                    onInputChange={props.onInputChange}
                    placeholder={props.placeholder}
                    onInternalizeValue={props.onInternalizeValue}
                    allowMissingValue={props.allowMissingValue}
                    addMissingText={props.addMissingText}
                    onRenderListItem={props.onRenderListItem}
                />
            )
        );
    }
}

export const FieldClass = SelectField;
export default connectField(SelectField);
