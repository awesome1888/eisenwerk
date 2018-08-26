import React from 'react';
import FormField from '../form.field/form.field.jsx';
import Select from '../../vazco-uniforms/field/select/select.jsx';

export default class FormSelect extends React.Component {
    render() {
        const {label, className, ...props} = this.props;
        return (
            <FormField
                className={className}
                label={label}
                component={Select}
                {...props}
            />
        );
    }
}
