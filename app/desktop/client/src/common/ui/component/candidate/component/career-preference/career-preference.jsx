import React from 'react';
import SubForm from '../../../sub-form/sub-form.jsx';
import ListField from '../../../vazco-uniforms/field/list/list.jsx';
import FormRow from '../../../form/form.row/form.row.jsx';
import FormSelect from '../../../form/form.select/form.select.jsx';
import FormField from '../../../form/form.field/form.field.jsx';
import Location from './component/location/location.jsx';
import Form from '../../../form/form.jsx';
import PageDefault, { PageDefaultBlock } from '../../../page-default/page-default.jsx';
import ButtonSelector from '../../../vazco-uniforms/field/button-selector/button-selector.jsx';

import preferredRoleEnum from '../../../../../entity/user/enum/candidate.preferred-role.enum.js';
import careerPreferenceTypeEnum from '../../../../../entity/user/enum/candidate.preference-type.enum.js';
import searchStatusEnum from '../../../../../entity/user/enum/candidate.search-status.enum.js';
import noticePeriodEnum from '../../../../../entity/user/enum/candidate.notice-period.enum.js';
import targetSalaryEnum from '../../../../../entity/user/enum/candidate.target-salary.enum.js';
import workRemoteEnum from '../../../../../entity/user/enum/candidate.work-remote.enum.js';
import preferredCompanyEnum from '../../../../../entity/user/enum/candidate.preferred-company.enum.js';
import preferredLocationEnum from '../../../../../entity/user/enum/candidate.preferred-location.enum.js';
import targetRateEnum from '../../../../../entity/user/enum/candidate.work-experience.enum.js';

import Model from './model.js';
import schema from './schema.js';

class CareerPreference extends SubForm {
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
            'data.careerPreference': this.getData().getCareerPreferences()
        };
    }

    getTitle() {
        return t('Career preferences');
    }

    getSubmitButtonTitle() {
        return this.props.isSignup ? 'Next' : 'Save';
    }

    onModelTransform(model) {
        if (_.isObjectNotEmpty(model.permanent)) {
            // unset other locations

            const locs = model.permanent.preferredLocation;
            if (!_.contains(locs, preferredLocationEnum.OTHER)) {
                delete model.permanent.otherLocation;
            }

            const fLocs = model.freelancer.preferredLocation;
            if (!_.contains(fLocs, preferredLocationEnum.OTHER)) {
                delete model.freelancer.otherLocation;
            }
        }
    }

    showPermanentLocations() {
        const model = this.getModel();
        return _.getValue(model, 'permanent.workRemote') !== workRemoteEnum.enums.RO;
    }

    showFreelancerLocations() {
        const model = this.getModel();
        return _.getValue(model, 'freelancer.workRemote') !== workRemoteEnum.enums.RO;
    }

    showPermanentLocationsPreferred() {
        const model = this.getModel();
        return (this.showPermanentLocations() && _.contains(_.getValue(model, 'permanent.preferredLocation'), preferredLocationEnum.enums.OT));
    }

    showFreelancerLocationsPreferred() {
        const model = this.getModel();
        return (this.showFreelancerLocations() && _.contains(_.getValue(model, 'freelancer.preferredLocation'), preferredLocationEnum.enums.OT));
    }

    renderCareerPreferenceChoice() {
        return (
            <PageDefault
                title={this.getTitle()}
                subtitle={t('Are you looking for permanent or freelance job opportunities (or both)?')}
            >
                <FormRow noMargin>
                    <FormField
                        component={ButtonSelector}
                        options={careerPreferenceTypeEnum.selectize()}
                        multiple
                        name="type"
                        buttonSize="width_50p"
                    />
                </FormRow>
            </PageDefault>
        );
    }

    renderPermanentForm() {
        return (
            <PageDefault
                title="Permanent job opportunities"
                subtitle="What should we know about your ideal permanent job?"
                className="margin-top_x1p65"
                border
            >
                <FormRow>
                    <FormSelect
                        label={t('Job search status')}
                        name="permanent.searchStatus"
                        options={searchStatusEnum.selectize()}
                        multiple={false}
                        searchable
                        className="medium-12 large-6"
                    />
                </FormRow>
                <FormRow>
                    <FormSelect
                        label={t('Notice period')}
                        name="permanent.noticePeriod"
                        options={noticePeriodEnum.selectize()}
                        multiple={false}
                        searchable
                        className="medium-12 large-6"
                    />
                </FormRow>
                <FormRow>
                    <FormSelect
                        label={t('Target salary (incl. bonus)')}
                        name="permanent.targetSalary"
                        options={targetSalaryEnum.selectize()}
                        multiple={false}
                        searchable
                        className="medium-12 large-6"
                    />
                </FormRow>
                <FormRow>
                    <FormSelect
                        label={t('Interested in working remotely')}
                        name="permanent.workRemote"
                        options={workRemoteEnum.selectize()}
                        multiple={false}
                        searchable
                        className="medium-12 large-6"
                    />
                </FormRow>
                <FormRow>
                    <FormField
                        label={t('Preferred permanent roles')}
                        component={ButtonSelector}
                        options={preferredRoleEnum.selectize()}
                        buttonSize="width_50p"
                        name="permanent.preferredRole"
                        enableAll
                    />
                </FormRow>
                <FormRow>
                    <FormField
                        label={t('Preferred companies')}
                        component={ButtonSelector}
                        options={preferredCompanyEnum.selectize()}
                        buttonSize="width_50p"
                        name="permanent.preferredCompany"
                        enableAll
                    />
                </FormRow>
                {
                    this.showPermanentLocations() &&
                    <FormRow>
                        <FormField
                            label={t('Preferred locations')}
                            component={ButtonSelector}
                            options={preferredLocationEnum.selectize()}
                            buttonSize="width_50p"
                            name="permanent.preferredLocation"
                            enableAll
                        />
                    </FormRow>
                }
                {
                    this.showPermanentLocationsPreferred() &&
                    <FormRow columns={2}>
                        <FormField
                            component={ListField}
                            name="permanent.otherLocation"
                            verticalSpaceClassName="rb-group"
                            initialCount={1}
                            dontfilterValues
                            className="medium-12 large-6"
                        >
                            <Location name="$" />
                        </FormField>
                    </FormRow>
                }
            </PageDefault>
        );
    }

    renderFreelancerForm() {
        return (
            <PageDefault
                title="Freelance job opportunities"
                subtitle="What should we know about your ideal freelance job?"
                border
            >
                <FormRow>
                    <FormSelect
                        label={t('Target rate')}
                        name="freelancer.targetRate"
                        options={targetRateEnum.selectize()}
                        multiple={false}
                        searchable
                        className="medium-12 large-6"
                    />
                </FormRow>
                <FormRow>
                    <FormSelect
                        label={t('Interested in working remotely')}
                        name="freelancer.workRemote"
                        options={workRemoteEnum.selectize()}
                        multiple={false}
                        searchable
                        className="medium-12 large-6"
                    />
                </FormRow>
                <FormRow>
                    <FormField
                        label={t('Preferred freelance roles')}
                        component={ButtonSelector}
                        options={preferredRoleEnum.selectize()}
                        buttonSize="width_50p"
                        name="freelancer.preferredRole"
                        enableAll
                    />
                </FormRow>
                <FormRow>
                    <FormField
                        label={t('Preferred companies')}
                        component={ButtonSelector}
                        options={preferredCompanyEnum.selectize()}
                        buttonSize="width_50p"
                        name="freelancer.preferredCompany"
                        enableAll
                    />
                </FormRow>
                {
                    this.showFreelancerLocations() &&
                    <FormRow>
                        <FormField
                            label={t('Preferred locations')}
                            component={ButtonSelector}
                            options={preferredLocationEnum.selectize()}
                            buttonSize="width_50p"
                            name="freelancer.preferredLocation"
                            enableAll
                        />
                    </FormRow>
                }
                {
                    this.showFreelancerLocationsPreferred() &&
                    <FormRow columns={2}>
                        <FormField
                            component={ListField}
                            name="freelancer.otherLocation"
                            verticalSpaceClassName="rb-group"
                            initialCount={1}
                            dontfilterValues
                            className="medium-12 large-6"
                        >
                            <Location name="$" />
                        </FormField>
                    </FormRow>
                }
            </PageDefault>
        );
    }

    renderForm() {
        const model = this.getModel();
        return (
            <Form
                ref={(ref) => { this._form = ref; }}
                noButtons
            >
                <div className="data-block__content-form-multiple">
                    {
                        this.renderCareerPreferenceChoice()
                    }
                    {
                        _.contains(model.type, careerPreferenceTypeEnum.enums.PO) &&
                        this.renderPermanentForm()
                    }
                    {
                        _.contains(model.type, careerPreferenceTypeEnum.enums.FO) &&
                        this.renderFreelancerForm()
                    }
                </div>
            </Form>
        );
    }

    renderFormContents() {
        console.dir(this.state);

        return (
            <PageDefaultBlock>
                {this.renderForm()}
            </PageDefaultBlock>
        );
    }
}

export default CareerPreference.connect({
    store: store => store.global,
    context: true,
    router: true
});
