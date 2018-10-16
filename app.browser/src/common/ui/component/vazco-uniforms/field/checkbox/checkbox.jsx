import React from 'react';
import connectField from 'uniforms/connectField';
import wrapField from './../../config/wrap-field.jsx';

const Bool = ({label, labelBefore, ...props}) =>
    wrapField(
        {label: labelBefore},
        (
            <label
                className={props.labelClass || 'form-checkbox__label'}
                htmlFor={props.id}
            >
                <input
                    className={props.inputClass || 'form-checkbox__input'}
                    checked={props.value}
                    disabled={props.disabled}
                    id={props.id}
                    name={props.name}
                    onClick={props.onClick}
                    onChange={() => {
                        if (props.onChange2) {
                            props.onChange2(!props.value);
                        }
                        props.onChange(!props.value);
                    }}
                    ref={props.inputRef}
                    type="checkbox"
                />
                {label}
            </label>
        )
    );

export default connectField(Bool);
