import React from 'react';
import BaseComponent from '../../../../../common/lib/ui/component/index.jsx';
import schema from './schema/schema.js';
import FormInput from '../../../../../common/ui/component/form/form.input/form.input.jsx';
import FormRow from '../../../../../common/ui/component/form/form.row/form.row.jsx';
import Form from '../../../../../common/ui/component/form/form.jsx';
import CustomForm from '../../../../../common/ui/component/vazco-uniforms/form/custom/custom.js';
import Modal from '../../../../../common/ui/component/modal/modal-controller.js';

class AccountPassword extends BaseComponent {

    constructor(props) {
        super(props);

        this.state = {
            model: {
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

    onSubmit(data) {
        const auth = this.getApplication().getAuthorization();

        auth.changePassword(this.getUser().getEmail(), data.oldPassword, data.password)
            .then((result) => {
                this.stop();
                this.closeModal();
            })
            .catch((e) => {
                this.stop();
                console.dir(e);

                const error = {};
                if (!_.isEmpty(e.errors)) {
                    if (_.isStringNotEmpty(e.errors.oldPassword)) {
                        error.oldPassword = e.errors.oldPassword;
                    }
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
                    title={t('Password')}
                    subtitle={t('Do you want to change something?')}
                    submitText={t('Save')}
                    onCloseClick={this.closeModal.bind(this)}
                    ref={(ref) => { this._form = ref; }}
                >
                    <FormRow>
                        <FormInput
                            label={t('Current password')}
                            name="oldPassword"
                            type="password"
                            inputClassName="field"
                            feedbackable={false}
                            errorMessageServer={this.state.error.oldPassword}
                            clearServerError={
                                this.clearServerError.bind(this)
                            }
                        />
                    </FormRow>
                    <FormRow>
                        <FormInput
                            label={t('New password')}
                            name="password"
                            type="password"
                            inputClassName="field"
                            feedbackable={false}
                        />
                    </FormRow>
                    <FormRow>
                        <FormInput
                            label={t('Repeat new password')}
                            name="passwordRepeat"
                            type="password"
                            inputClassName="field"
                            feedbackable={false}
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

export default AccountPassword.connect({
    store: store => store.global,
    context: true,
});
