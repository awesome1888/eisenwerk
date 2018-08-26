import React from 'react';
import BaseComponent from '../../../common/lib/ui/component/index.jsx';
import schema from './schema/schema.js';
import FormInput from '../../../common/ui/component/form/form.input/form.input.jsx';
import FormRow from '../../../common/ui/component/form/form.row/form.row.jsx';
import Form from '../../../common/ui/component/form/form.jsx';
import CustomForm from '../../../common/ui/component/vazco-uniforms/form/custom/custom.js';
import Authentication from '../../../common/ui/component/authentication/authentication.jsx';
import OptionBar from './../option-bar/option-bar.jsx';
import StepEnum from './enum/signup-step.enum.js';

class UserSignup extends BaseComponent {
    constructor() {
        super();
        this.state = {
            formError: null,
            error: {},
            model: {}
        };
    }

    getStepUrl() {
        return StepEnum.getValueByIndex(0);
    }

    onSuccess(data) {
        const auth = this.getApplication().getAuthorization();
        auth.signInLocal(data.email, data.password).then((result) => {
            console.dir(result);
            this.stop();
            // this.redirectTo(this.getStepUrl());
        }).catch((e) => {
            console.dir('failed!');
            console.dir(e);
        });
    }

    onSubmitForm(data) {
        const users = this.getApplication().getNetwork().service('users');
        users.create({
            profile: {
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                password: data.password,
            },
            role: ['P'],
            data: {},
            isVerified: true
        }).then(() => {
            this.onSuccess(data);
        }).catch((e) => {
            this.stop();
            console.dir(e);

            const error = {};
            if (!_.isEmpty(e.errors) && _.isStringNotEmpty(e.errors.email)) {
                error.email = e.message;
            }

            this.setState({
                error
            });
        });
    }

    displayError() {
        if (this.state.formError) {
            if (_.keys(this.state.error).length === 0) {
                return (
                    <div className="form__error">
                        {this.state.formError}
                    </div>
                );
            }
        }
        return null;
    }

    clearServerError(fieldName) {
        const error = this.state.error;
        error[fieldName] = null;
        this.setState({
            error
        });
    }

    onValidate(data, error, cb) {
        if (error && error.error === 'validation-error') {
            this.stop();
        }

        return cb();
    }

    stop() {
        if (this._form) {
            this._form.stopSubmitButton();
        }
    }

    renderForm() {
        const linkTOS = (<a href="https://sevenlanes.com/terms" target="_blank" rel="noopener noreferrer" className="link_legal">{t('terms of service')}</a>);
        const linkPrivacy = (<a href="https://sevenlanes.com/privacy" target="_blank" rel="noopener noreferrer" className="link_legal">{t('privacy policy')}</a>);
        return (
            <Form
                title={t('Signup')}
                subtitle={t('Nice to meet you!')}
                submitText={t('Sign up')}
                ref={(ref) => { this._form = ref; }}
            >
                <FormRow columns={2}>
                    <FormInput
                        className="small-12 medium-6"
                        label={t('First name')}
                        name="firstName"
                    />
                    <FormInput
                        className="small-12 medium-6"
                        label={t('Last name')}
                        name="lastName"
                    />
                </FormRow>
                <FormRow>
                    <FormInput
                        label={t('Email address')}
                        name="email"
                        type="email"
                        errorMessageServer={this.state.error.email}
                        clearServerError={this.clearServerError.bind(this, 'email')}
                        autoCapitalize="none"
                    />
                </FormRow>
                <FormRow>
                    <FormInput
                        label={t('Password')}
                        name="password"
                        type="password"
                        autoCapitalize="none"
                    />
                    <div className="signup-block__acceptance col-sm-12">
                        {t('We will always treat your data confidentially, never send spam and allow you to delete your free account at any time. With your registration you accept our $(0) and our $(1).', linkTOS, linkPrivacy)}
                    </div>
                </FormRow>
                {
                    this.displayError()
                }
            </Form>
        );
    }

    renderFooter() {
        return (
            <OptionBar login employers />
        );
    }

    render() {
        return (
            <Authentication footer={this.renderFooter()}>
                <CustomForm
                    schema={schema}
                    model={this.state.model}
                    label={false}
                    onSubmit={this.onSubmitForm.bind(this)}
                    onValidate={this.onValidate.bind(this)}
                    showInlineError
                >
                    {this.renderForm()}
                </CustomForm>
            </Authentication>
        );
    }
}

export default UserSignup.connect({
    store: store => store.global,
    context: true,
    router: true,
});
