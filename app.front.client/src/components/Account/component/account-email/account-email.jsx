import React from 'react'
import BaseComponent from '../../../../../common/lib/ui/component/index.jsx';
import schema from './schema/schema.js';
import FormInput from '../../../../../common/ui/component/form/form.input/form.input.jsx';
import FormRow from '../../../../../common/ui/component/form/form.row/form.row.jsx';
import Form from '../../../../../common/ui/component/form/form.jsx';
import CustomForm from '../../../../../common/ui/component/vazco-uniforms/form/custom/custom.js';
import Modal from '../../../../../common/ui/component/modal/modal-controller.js';

class AccountEmail extends BaseComponent {

    constructor(props) {
        super(props);

        this.state = {
            model: {
                emailCurrent: this.getUser().getEmail(),
            },
            error: {},
        };
    }

    getUser() {
        return this.props.user;
    }

    closeModal() {
        Modal.close();
    }

    onSuccess(result) {
        if (_.isFunction(this.props.onEmailChange)) {
            this.props.onEmailChange(result);
        }

        this.getApplication().reloadUser();
    }

    changeEmail(data) {
        const auth = this.getApplication().getAuthorization();
        auth.changeEmail(data.password, data.emailCurrent, data.email)
            .then((result) => {
                this.stop();
                this.onSuccess(result);
                this.closeModal();
            })
            .catch((e) => {
                console.dir(e);
                this.stop();

                const error = {};
                if (!_.isEmpty(e.errors)) {
                    if (_.isStringNotEmpty(e.errors.password)) {
                        error.password = e.errors.password;
                    } else if (_.isStringNotEmpty(e.errors.email)) {
                        error.email = e.errors.email;
                    } else {
                        error.generic = e.message;
                    }
                }

                this.setState({
                    error
                });

            });
    }

    onSubmit(data) {
        const auth = this.getApplication().getAuthorization();

        auth.checkEmail(data.email, this.getUser().getId())
            .then(() => {
                this.changeEmail(data);
            })
            .catch((e) => {
                this.stop();
                console.dir(e);

                const error = {};
                if (!_.isEmpty(e.errors) && _.isStringNotEmpty(e.errors['profile.email']) ) {
                    error.email = e.errors['profile.email'];
                }

                this.setState({
                    error
                });
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

    clearServerError() {
        this.setState({
            error: {},
        });
    }

    render() {
        return (
            <CustomForm
                showInlineError
                schema={schema}
                label={false}
                model={this.state.model}
                onSubmit={this.onSubmit.bind(this)}
                onValidate={this.onValidate.bind(this)}
                className="form data-block-stack hack__controls-deface"
            >
                <Form
                    title={t('Email address')}
                    subtitle={t('Do you want to change something?')}
                    submitText={t('Save')}
                    onCloseClick={this.closeModal.bind(this)}
                    ref={(ref) => { this._form = ref; }}
                >
                    <FormRow>
                        <FormInput
                            label={t('Current password')}
                            name="password"
                            type="password"
                            inputClassName="field"
                            feedbackable={false}
                            showInlineError
                            errorMessageServer={this.state.error.password}
                            clearServerError={
                                this.clearServerError.bind(this)
                            }
                        />
                    </FormRow>
                    <FormRow>
                        <FormInput
                            label={t('New email address')}
                            name="email"
                            inputClassName="field"
                            feedbackable={false}
                            errorMessageServer={this.state.error.email}
                            clearServerError={
                                this.clearServerError.bind(this)
                            }
                            type="email"
                            autoCapitalize="none"
                        />
                    </FormRow>
                    <FormRow>
                        <FormInput
                            label={t('Repeat new email address')}
                            name="emailRepeat"
                            inputClassName="field"
                            feedbackable={false}
                            type="email"
                            clearServerError={
                                this.clearServerError.bind(this)
                            }
                            autoCapitalize="none"
                        />
                    </FormRow>
                    {
                        _.isStringNotEmpty(this.state.error.generic)
                        &&
                        <span className="form__error">
                            {this.state.error.generic}
                        </span>
                    }
                </Form>
            </CustomForm>
        );
    }
}

export default AccountEmail.connect({
    store: store => store.global,
    context: true,
});
