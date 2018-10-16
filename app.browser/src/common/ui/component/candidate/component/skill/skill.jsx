import React from 'react';

import SubForm from '../../../sub-form/sub-form.jsx';

import ListField from '../../../vazco-uniforms/field/list/list.jsx';
import SkillItem from './component/skill/skill.jsx';

import Form from '../../../form/form.jsx';
import { PageDefaultBlock } from '../../../page-default/page-default.jsx';


import Model from './model.js';
import schema from './schema.js';

class Skill extends SubForm {
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
            data: {
                skills: this.getData().getSkills(),
            },
        };
    }

    getTitle() {
        return t('Skills');
    }

    getSubmitButtonTitle() {
        return this.props.isSignup ? 'Next' : 'Save';
    }

    renderForm() {
        return (
            <Form
                title={this.getTitle()}
                subtitle={t('What (software) tools or programming languages are you experienced with?')}
                ref={(ref) => { this._form = ref; }}
                noButtons
                className="form_width__limited"
            >
                <ListField
                    name="skills"
                    verticalSpaceClassName="rb-group"
                    initialCount={1}
                >
                    <SkillItem
                        name="$"
                    />
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

export default Skill.connect({
    store: store => store.global,
    context: true,
    router: true
});
