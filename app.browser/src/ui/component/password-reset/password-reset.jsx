import React from 'react';
import BaseComponent from '../../../common/lib/ui/component/index.jsx';
import schema from './schema/schema.js';
import CustomForm from '../../../common/ui/component/vazco-uniforms/form/custom/custom.js';
import Authentication from '../../../common/ui/component/authentication/authentication.jsx';
import FormInput from '../../../common/ui/component/form/form.input/form.input.jsx';
import FormRow from '../../../common/ui/component/form/form.row/form.row.jsx';
import Form from '../../../common/ui/component/form/form.jsx';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';

class PasswordReset extends BaseComponent {
    constructor() {
        super();
        this.state = {
            msg: '',
            isSuccessful: false,
        };
    }

    onSubmit(data) {
        const auth = this.getApplication().getAuthorization();
        const token = _.getValue(this.props, 'match.params.token');
        auth.resetPassword(token, data.password).then((result) => {
            // console.dir(result);

            this.disableButton();
            this.setState({
                isSuccessful: true
            });
        }).catch((e) => {
            this.disableButton();
            // console.dir(e);

            this.setState({
                msg: e.message
            });
        });
    }

    disableButton() {
        if (this._form) {
            this._form.stopSubmitButton();
        }
    }

    renderForm() {
        return (
            <Form
                title={t('Password reset')}
                subtitle={t('Choose a new password.')}
                submitText={t('Submit')}
                ref={(ref) => { this._form = ref; }}
            >
                <FormRow>
                    <FormInput
                        label={t('New password')}
                        maxLength="256"
                        name="password"
                        type="password"
                    />
                </FormRow>
                <FormRow>
                    <FormInput
                        label={t('Repeat new password')}
                        maxLength="256"
                        name="passwordConfirm"
                        type="password"
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
                <div className="form__block" >
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
                    {
                        this.state.msg
                        &&
                        <div className="form__error">
                            {this.state.msg}
                        </div>
                    }
                </div>
            </Authentication>
        );
    }
}

export default PasswordReset.connect({
    store: store => store.global,
    context: true,
    router: true,
});
