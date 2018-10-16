import React from 'react';

import SubForm from '../../../sub-form/sub-form.jsx';
import { PageDefaultBlock } from '../../../page-default/page-default.jsx';
import {ButtonLikeSelectbox} from '../../../vazco-uniforms/field/button-like-selectbox/button-like-selectbox.jsx';
import FilePickerVazco from '../../../vazco-uniforms/field/file-picker/file-picker.jsx';
import documentTypeEnum from '../../../../../lib/enum/document-type.enum.js';
import FormRow from '../../../form/form.row/form.row.jsx';
import FormSelect from '../../../form/form.select/form.select.jsx';
import FormField from '../../../form/form.field/form.field.jsx';
import Form from '../../../form/form.jsx';

import Model from './model.js';
import schema from './schema.js';

class Document extends SubForm {
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
            'data.document': this.getData().getDocuments()
        };
    }

    getTitle() {
        return t('Documents');
    }

    hasDocumentUploaded() {
        const model = this.getModel();
        return !_.isUndefined(model.name);
    }

    onDocumentUploaded(url, name) {
        this.getModel().name = name;
        this.getModel().createdAt = new Date(); // todo: better place it server-side, but this is not crucial

        this.forceUpdate();
    }

    onUploadValueRender() {
        const name = this.getModel().name;
        return _.isStringNotEmpty(name) ? name : '';
    }

    renderExtraTextButton() {
        if (!this.getModel().url) {
            return null;
        }
        return (
            <a
                className="button-erase"
                href={this.getModel().url}
                target="_blank"
                rel="noopener noreferrer"
            >
                {t('Open')}
            </a>
        );
    }

    renderForm() {
        return (
            <Form
                title={this.getTitle()}
                subtitle={t('What do you want to upload?')}
                ref={(ref) => { this._form = ref; }}
                noButtons
                className={`form_width__limited ${(!this.isNewSubItem() || this.hasDocumentUploaded()) ? '' : 'padding-bottom'}`}
                onDeleteClick={!this.isNewSubItem() && this.onDeleteClick.bind(this)}
                extraTextButtons={this.renderExtraTextButton()}
            >
                <FormRow>
                    <FormSelect
                        label={t('Document type')}
                        name="type"
                        options={documentTypeEnum.selectize()}
                        multiple={false}
                    />
                </FormRow>
                <FormRow>
                    <FormField
                        label={t('File on your computer')}
                        component={FilePickerVazco}
                        name="url"
                        isPdf
                        onChange2={this.onDocumentUploaded.bind(this)}
                    >
                        <ButtonLikeSelectbox
                            classNameIcon="icon_file-upload"
                            onValueRender={this.onUploadValueRender.bind(this)}
                        />
                    </FormField>
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

export default Document.connect({
    store: store => store.global,
    context: true,
    router: true
});
