import React from 'react';
import SubForm from '../../../sub-form/sub-form.jsx';

import DateTextSelector from '../../../vazco-uniforms/field/date-text-selector/date-text-selector.jsx';
import PlaceAutocomplete from '../../../vazco-uniforms/field/place-autocomplete/place-autocomplete.jsx';

import FilePickerVazco from '../../../vazco-uniforms/field/file-picker/file-picker.jsx';
import FileStackUtil from './../../../../../lib/util/filestack-image/filestack-image.js';

import Model from './model.js';
import schema from './schema.js';

import FormInput from '../../../form/form.input/form.input.jsx';
import FormRow from '../../../form/form.row/form.row.jsx';
import FormField from '../../../form/form.field/form.field.jsx';
import Form from '../../../form/form.jsx';
import PageDefault, { PageDefaultBlock } from '../../../page-default/page-default.jsx';
import Util from './../../../../../lib/util/index.js';
import ImageUser from './component/image-user/image-user.jsx';

class MainForm extends SubForm {
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
            profile: {
                phoneNumber: this.getData().getPhoneNumber(),
                dateOfBirth: this.getData().getBirthDate(),
                residence: this.getData().getResidence(),
                uploadedFileUrl: this.getData().getAvatar(),
            },
        };
    }

    getTitle() {
        return t('Personal information');
    }

    renderImageBlock() {
        const model = this.getModel();

        let avatarStyle = {};
        let initials = '';
        if (model.uploadedFileUrl) {
            const image = FileStackUtil.getUrlResized(model.uploadedFileUrl);
            avatarStyle = {backgroundImage: `url(${image})`};
        } else {
            const firstName = this.props.data.getFirstName(); // || _.getValue(Meteor.user(), 'profile.firstName');
            const lastName = this.props.data.getLastName(); // || _.getValue(Meteor.user(), 'profile.lastName');
            initials = Util.getInitials(firstName, lastName);
        }

        return (
            <PageDefault
                title={t('Profile picture')}
                subtitle={t('Would you like to add more personality to your profile?')}
            >
                <ImageUser initials={initials} avatarStyle={avatarStyle} />
                <FilePickerVazco
                    name="uploadedFileUrl"
                    text={t('Upload')}
                    className="rb-inline-block"
                    buttonClassName="button_back"
                    isImg
                />
            </PageDefault>
        );
    }

    renderPersonalInformation() {
        return (
            <Form
                title={t('Personal information')}
                subtitle="What should we know about you?"
                ref={(ref) => { this._form = ref; }}
                noButtons
                className="form_width__limited"
            >
                <FormRow>
                    <FormField
                        label="Date of birth (DD.MM.YYYY)"
                        component={DateTextSelector}
                        name="dateOfBirth"
                    />
                </FormRow>
                <FormRow>
                    <FormField
                        label={t('Residence (city)')}
                        component={PlaceAutocomplete}
                        name="residence"
                    />
                </FormRow>
                <FormRow>
                    <FormInput
                        label={t('Mobile phone number')}
                        name="phone"
                        feedbackable={false}
                    />
                </FormRow>
            </Form>
        );
    }


    renderFormContents() {
        return (
            <div className="block-stack">
                <PageDefaultBlock border>
                    {this.renderImageBlock()}
                </PageDefaultBlock>
                <PageDefaultBlock>
                    {this.renderPersonalInformation()}
                </PageDefaultBlock>
            </div>
        );
    }
}


export default MainForm.connect({
    store: store => store.global,
    context: true,
    router: true
});
