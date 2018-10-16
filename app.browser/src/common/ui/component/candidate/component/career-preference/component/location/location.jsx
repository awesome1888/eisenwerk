import React from 'react';
import FormRow from '../../../../../../../ui/component/form/form.row/form.row.jsx';
import FormField from '../../../../../../../ui/component/form/form.field/form.field.jsx';
import PlaceAutocomplete from '../../../../../../../ui/component/vazco-uniforms/field/place-autocomplete/place-autocomplete.jsx';

export default class LocationForm extends React.Component {
    render() {
        return (
            <FormRow simple>
                <FormField
                    label={t('Location (city)')}
                    component={PlaceAutocomplete}
                    name={this.props.name}
                />
            </FormRow>
        );
    }
}
