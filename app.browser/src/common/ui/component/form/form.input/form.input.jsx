import React from 'react';
import FormField from '../form.field/form.field.jsx';
import TextField from '../../vazco-uniforms/field/text/text.jsx';

export default class FormInput extends React.Component {
    render() {
        const {label, className, ...props} = this.props;
        return (
            <FormField
                label={label}
                className={className}
                component={TextField}
                {...props}
            />
        );
    }
}
