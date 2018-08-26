import React from 'react';

import SubForm from '../../../sub-form/sub-form.jsx';
import ListField from '../../../vazco-uniforms/field/list/list.jsx';
import FormRow from '../../../form/form.row/form.row.jsx';
import FormSelect from '../../../form/form.select/form.select.jsx';
import FormField from '../../../form/form.field/form.field.jsx';
import ExperienceItem from './component/experience/experience.jsx';
import Form from '../../../form/form.jsx';
import { PageDefaultBlock } from '../../../page-default/page-default.jsx';
import ButtonSelector from '../../../vazco-uniforms/field/button-selector/button-selector.jsx';

import workExperienceEnum from '../../../../../entity/user/enum/candidate.work-experience.enum.js';
import preferredRoleEnum from '../../../../../entity/user/enum/candidate.preferred-role.enum.js';
import nrReportingEnum from '../../../../../entity/user/enum/candidate.number-reporting.enum.js';

import Model from './model.js';
import schema from './schema.js';

class Expertise extends SubForm {
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
            'data.expertise': this.getData().getExpertise()
        };
    }

    getTitle() {
        return t('Expertise');
    }

    hasChosenType() {
        const model = this.getModel();
        return (model.type && model.type.length > 0);
    }

    onModelTransform(model) {
        const newExperience = [];
        _.each(model.type, (item) => {
            let exp = {};

            if (_.isArrayNotEmpty(model.specialities)) {
                exp = model.specialities.find((e) => {
                    return e.key === item;
                });
            }

            if (_.isEmpty(exp) || _.isUndefined(exp)) {
                exp = {
                    key: item,
                    experience: ''
                };
            }
            newExperience.push(exp);
        });

        model.specialities = newExperience;
    }

    getSubmitButtonTitle() {
        return this.props.isSignup ? 'Next' : 'Save';
    }

    renderForm() {
        return (
            <Form
                title={this.getTitle()}
                subtitle={t('What should we know about your background?')}
                ref={(ref) => { this._form = ref; }}
                noButtons
            >
                <FormRow>
                    <FormSelect
                        label={t('Overall Data Science experience')}
                        name="overall"
                        options={workExperienceEnum.selectize()}
                        multiple={false}
                        className="medium-12 large-6"
                    />
                </FormRow>
                <FormRow>
                    <FormField
                        label={t('Specialities')}
                        name="type"
                        component={ButtonSelector}
                        options={preferredRoleEnum.selectize()}
                        multiple
                        buttonSize="width_50p"
                    />
                </FormRow>
                {
                    this.hasChosenType()
                    &&
                    <div className="form_width__limited">
                        <div className="margin-bottom_x3">
                            <ListField
                                name="specialities"
                                verticalSpaceClassName="rb-group form__block-inner-limited"
                                initialCount={1}
                                showButtons={false}
                            >
                                <ExperienceItem name="$" />
                            </ListField>
                        </div>
                    </div>
                }
                <FormRow>
                    <FormSelect
                        label={t('Number of people (currently) reporting to you')}
                        name="nrReporting"
                        options={nrReportingEnum.selectize()}
                        multiple={false}
                        className="medium-12 large-6"
                    />
                </FormRow>
            </Form>
        );
    }

    renderFormContents() {
        return (
            <PageDefaultBlock>
                {this.renderForm()}
            </PageDefaultBlock>
        );
    }
}

export default Expertise.connect({
    store: store => store.global,
    context: true,
    router: true
});