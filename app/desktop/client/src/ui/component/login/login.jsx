import React from 'react';
import BaseComponent from '../../../common/lib/ui/component/index.jsx';
import schema from './schema/schema.js';
import FormInput from '../../../common/ui/component/form/form.input/form.input.jsx';
import FormRow from '../../../common/ui/component/form/form.row/form.row.jsx';
import Form from '../../../common/ui/component/form/form.jsx';
import CustomForm from '../../../common/ui/component/vazco-uniforms/form/custom/custom.js';
import Authentication from '../../../common/ui/component/authentication/authentication.jsx';
import OptionBar from './../option-bar/option-bar.jsx';
import errors from '@feathersjs/errors';

class UserLogin extends BaseComponent {
    constructor() {
        super();
        this.state = {
            errorMessage: null
        };
    }

    componentDidMount() {
        // // Take the token from the URL
        // const concatToken = FlowRouter.current().queryParams.token;
        // // If it exists
        // if (concatToken) {
        //     // Get the token and id from the url
        //     const _token = concatToken.substring(0, 256);
        //     const id = concatToken.substring(256, concatToken.length);
        //     // Call the method of impersonation
        //     Meteor.call('user.admin.token.impersonate.loginAs', _token, id, (error, result) => {
        //         //  If it fails, throw an error
        //         if (error) {
        //             throw new Meteor.Error(400, t('An unknown error has occured!'));
        //         } else {
        //             // Otherwise proceed.
        //             /*
        //                 Note: If you do Meteor.connection.setUserId but
        //                 the method did not do it too, it will log the user out
        //                 so it is secure
        //             */
        //             Meteor.connection.setUserId(result);
        //             window.localStorage.impersonation = true;
        //             // After loging the user, redirect him to home.
        //             FlowRouter.go('/');
        //         }
        //     });
        // }
    }

    onSubmitForm(data) {
        const auth = this.getApplication().getAuthorization();
        auth.signInLocal(data.email, data.password).then((res) => {
            this.stop();
        }).catch((e) => {
            if (e instanceof errors.NotAuthenticated) {
                this.setState({
                    errorMessage: e.message
                });
            }

            this.stop();
        });
    }

    onSubmitFailure() {
        this.setState({
            errorMessage: t('Invalid credentials')
        });
    }

    clearServerError() {
        this.setState({
            errorMessage: null
        });
    }

    stop() {
        if (this._form) {
            this._form.stopSubmitButton();
        }
    }

    onValidate(data, error, cb) {
        if (error && error.error === 'validation-error') {
            this.stop();
        }

        return cb();
    }

    renderForm() {
        return (
            <Form
                title={t('Login')}
                subtitle={t('Welcome back!')}
                submitText={t('Log in')}
                ref={(ref) => { this._form = ref; }}
            >
                <FormRow>
                    <FormInput
                        label={t('Email address')}
                        name="email"
                        type="email"
                        autoCapitalize="none"
                        maxLength="256"
                    />
                </FormRow>
                <FormRow simple0>
                    <FormInput
                        label={t('Password')}
                        name="password"
                        type="password"
                        autoCapitalize="none"
                    />
                </FormRow>
                {
                    this.state.errorMessage
                    &&
                    <div className="form__error margin-top-negative_x2p5">
                        {this.state.errorMessage}
                    </div>
                }
            </Form>
        );
    }
    onChangeModelHandler() {
        this.clearServerError();
    }

    renderFooter() {
        return (
            <OptionBar register forgot />
        );
    }

    render() {
        return (
            <Authentication footer={this.renderFooter()}>
                <CustomForm
                    schema={schema}
                    id="email-form"
                    name="email-form"
                    label={false}
                    onSubmit={this.onSubmitForm.bind(this)}
                    onSubmitFailure={this.onSubmitFailure.bind(this)}
                    onValidate={this.onValidate.bind(this)}
                    onChangeModel={this.onChangeModelHandler.bind(this)}
                    showInlineError
                >
                    {this.renderForm()}
                </CustomForm>
            </Authentication>
        );
    }
}

export default UserLogin.connect({
    store: store => store.global,
    context: true,
    router: true,
});
