import React from 'react';
import BaseComponent from '../../../common/lib/ui/component/index.jsx';
import schema from './schema.js';
import CustomForm from '../../../common/ui/component/vazco-uniforms/form/custom/custom.js';
import FormInput from '../../../common/ui/component/form/form.input/form.input.jsx';
import FormRow from '../../../common/ui/component/form/form.row/form.row.jsx';
import Form from '../../../common/ui/component/form/form.jsx';
import Authentication from '../../../common/ui/component/authentication/authentication.jsx';
import { Link } from 'react-router-dom';

class PasswordForgot extends BaseComponent {
    constructor() {
        super();

        this.state = {
            isSuccessful: false,
            errorMessage: {},
        };
    }

    onSubmit(data) {
        const auth = this.getApplication().getAuthorization();
        auth.sendResetPassword(data.email).then((result) => {
            // console.dir(result);
            this.disableButton();
            this.setState({
                isSuccessful: true
            });
        }).catch((e) => {
            this.disableButton();

            const errorMessage = this.state.errorMessage;
            errorMessage.errorEmail = t('Email address not found');
            this.setState({
                errorMessage,
            });
        });
    }

    clearServerError(fieldName) {
        const errorMessage = this.state.errorMessage;
        errorMessage[fieldName] = null;
        this.setState({
            errorMessage
        });
    }

    disableButton() {
        if (this._form) {
            this._form.stopSubmitButton();
        }
    }

    onBackClickHandler() {
        this.redirectTo("/login");
    }

    renderForm() {
        return (
            <Form
                title={t('Password reset')}
                subtitle={t('Enter your account recovery email address.')}
                submitText={t('Submit')}
                // backUrl="/login"
                ref={(ref) => { this._form = ref; }}
                onBackClick={this.onBackClickHandler.bind(this)}
            >
                <FormRow>
                    <FormInput
                        label={t('Email address')}
                        name="email"
                        maxLength="256"
                        type="email"
                        autoCapitalize="none"
                        clearServerError={
                            this.clearServerError.bind(this, 'errorEmail')
                        }
                        errorMessageServer={this.state.errorMessage.errorEmail}
                    />
                </FormRow>
            </Form>
        );
    }

    renderSuccess() {
        return (
            <Authentication>
                <Form
                    title={t('Password reset')}
                    subtitle={t('Your password has been successfully reset.')}
                    hidePrevButton
                    noButtons
                >
                    <Link className="button button_blue" to="/login">{t('Log in')}</Link>
                </Form>
            </Authentication>
        );
    }

    render() {

        if (this.state.isSuccessful) {
            return this.renderSuccess();
        }

        return (
            <Authentication >
                <CustomForm
                    schema={schema}
                    id="email-form"
                    name="email-form"
                    label={false}
                    onSubmit={this.onSubmit.bind(this)}
                    onValidate={(...a) => this._form.onValidate(...a)}
                    showInlineError
                >
                    {this.renderForm()}
                </CustomForm>
            </Authentication>
        );
    }
}

export default PasswordForgot.connect({
    store: store => store.global,
    context: true,
    router: true
});
