import React from 'react';

import SubForm from '../../../sub-form/sub-form.jsx';
import { PageDefaultBlock } from '../../../page-default/page-default.jsx';

import yearEnum from '../../../../../lib/enum/year.enum.js';

import Model from './model.js';
import schema from './schema.js';

import FormRow from '../../../form/form.row/form.row.jsx';
import FormInput from '../../../form/form.input/form.input.jsx';
import FormSelect from '../../../form/form.select/form.select.jsx';
import Form from '../../../form/form.jsx';

class EducationHighItem extends SubForm {
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
            'data.education': this.getData().getEducation()
        };
    }

    getTitle() {
        return t('Education');
    }

    getYearEnum() {
        if (!this._yearEnum) {
            this._yearEnum = yearEnum.makeFromRange(2024, 2000);
        }

        return this._yearEnum;
    }

    renderForm() {
        return (
            <Form
                title={this.getTitle()}
                subtitle={t('Which educational institution would you like to add?')}
                ref={(ref) => { this._form = ref; }}
                noButtons
                className={`form_width__limited ${!this.isNewSubItem() ? '' : 'padding-bottom'}`}
                onDeleteClick={!this.isNewSubItem() && this.onDeleteClick.bind(this)}
            >
                <FormRow>
                    <FormInput
                        label={t('University or college')}
                        name="universityName"
                    />
                </FormRow>
                <FormRow>
                    <FormInput
                        label={t('Degree and study field')}
                        name="courseName"
                    />
                </FormRow>
                <FormRow>
                    <FormSelect
                        label={t('Start date')}
                        name="start"
                        options={this.getYearEnum()}
                        multiple={false}
                    />
                </FormRow>
                <FormRow>
                    <FormSelect
                        label={t('End date')}
                        name="end"
                        options={this.getYearEnum()}
                        multiple={false}
                    />
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

export default EducationHighItem.connect({
    store: store => store.global,
    context: true,
    router: true
});
