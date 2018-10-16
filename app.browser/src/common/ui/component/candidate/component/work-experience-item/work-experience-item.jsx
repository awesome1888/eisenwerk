import React from 'react';

import SubForm from '../../../sub-form/sub-form.jsx';
import { PageDefaultBlock } from '../../../page-default/page-default.jsx';

import GenericField from '../../../vazco-uniforms/field/generic/generic.jsx';
import Checkbox from '../../../vazco-uniforms/field/checkbox/checkbox.jsx';

import Model from './model.js';
import schema from './schema.js';

import LongTextField from 'uniforms-unstyled/LongTextField';
import FormInput from '../../../form/form.input/form.input.jsx';
import FormRow from '../../../form/form.row/form.row.jsx';
import FormField from '../../../form/form.field/form.field.jsx';
import Form from '../../../form/form.jsx';
import GenericFieldContentDate from '../../../util/generic-field-content-date/generic-field-content-date.jsx';

class WorkExperience extends SubForm {
    getModelController() {
        return Model;
    }

    getSchema() {
        return schema;
    }

    getApplication() {
        return this.props.application;
    }

    getService() {
        return this.getApplication().getNetwork().service('users');
    }

    getDataToSave() {
        return {
            'data.workExperience': this.getData().getWorkExperience()
        };
    }

    getTitle() {
        return t('Professional experience');
    }

    isCurrent() {
        return this.getModel().current;
    }

    renderForm() {
        return (
            <Form
                title={t('Professional experience')}
                subtitle={t('Which employer would you like to add?')}
                ref={(ref) => { this._form = ref; }}
                noButtons
                className={`form_width__limited ${!this.isNewSubItem() ? '' : 'padding-bottom'}`}
                onDeleteClick={!this.isNewSubItem() && this.onDeleteClick.bind(this)}
            >
                <FormRow>
                    <FormInput
                        label={t('Company')}
                        name="companyName"
                        feedbackable={false}
                    />
                </FormRow>
                <FormRow>
                    <FormInput
                        label={t('Job title')}
                        name="occupation"
                        feedbackable={false}
                    />
                </FormRow>
                <FormRow>
                    <FormField
                        label={t('Description (optional)')}
                        component={LongTextField}
                        name="description"
                        feedbackable={false}
                    />
                </FormRow>
                <FormRow>
                    <FormField
                        label={t('Start date')}
                        component={GenericField}
                        name="start"
                    >
                        <GenericFieldContentDate />
                    </FormField>
                </FormRow>
                <FormRow>
                    <FormField
                        label={t('End date')}
                        component={GenericField}
                        name="end"
                        disabled={this.isCurrent()}
                    >
                        <GenericFieldContentDate />
                    </FormField>
                    <div className="margin-top-negative_x1p6 col-sm-12">
                        <Checkbox
                            name="current"
                            labelClass="form-checkbox__label display-inline-block"
                            inputClass="rb-i-margin-r_x0p5 form-checkbox__input"
                            label={t('I currently work here')}
                        />
                    </div>
                </FormRow>
            </Form>
        );
    }

    renderFormContents() {
        return (
            <PageDefaultBlock
                className={this.isExisting() ? 'padding-bottom' : ''}
            >
                {this.renderForm()}
            </PageDefaultBlock>
        );
    }
}

export default WorkExperience.connect({
    store: store => store.global,
    context: true,
    router: true
});
