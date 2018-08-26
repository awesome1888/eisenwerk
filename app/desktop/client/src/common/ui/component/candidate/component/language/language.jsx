import React from 'react';

import SubForm from '../../../sub-form/sub-form.jsx';
import ListField from '../../../vazco-uniforms/field/list/list.jsx';
import LanguageItem from './component/language/language.jsx';
import Form from '../../../form/form.jsx';
import { PageDefaultBlock } from '../../../page-default/page-default.jsx';

import Model from './model.js';
import schema from './schema.js';

class Language extends SubForm {
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
            'data.language': this.getData().getLanguages()
        };
    }

    getTitle() {
        return t('Languages');
    }

    getSubmitButtonTitle() {
        return this.props.isSignup ? 'Next' : 'Save';
    }

    renderForm() {
        return (
            <Form
                title={this.getTitle()}
                subtitle={t('What languages do you speak?')}
                ref={(ref) => { this._form = ref; }}
                noButtons
                className="form_width__limited"
            >
                <ListField
                    name="language"
                    verticalSpaceClassName="rb-group"
                    initialCount={1}
                >
                    <LanguageItem name="$" />
                </ListField>
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

export default Language.connect({
    store: store => store.global,
    context: true,
    router: true
});
