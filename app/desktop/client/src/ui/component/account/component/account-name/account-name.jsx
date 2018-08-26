import React from 'react'
import BaseComponent from '../../../../../common/lib/ui/component/index.jsx';
import schema from './schema/schema.js';
import FormInput from '../../../../../common/ui/component/form/form.input/form.input.jsx';
import FormSelect from '../../../../../common/ui/component/form/form.select/form.select.jsx';
import FormRow from '../../../../../common/ui/component/form/form.row/form.row.jsx';
import Form from '../../../../../common/ui/component/form/form.jsx';
import CustomForm from '../../../../../common/ui/component/vazco-uniforms/form/custom/custom.js';
import genderEnum from '../../../../../common/entity/user/enum/gender.enum.js';
import Modal from '../../../../../common/ui/component/modal/modal-controller.js';

class AccountName extends BaseComponent {


    constructor(props) {
        super(props);

        this.state = {
            model: {
                firstName: this.getUser().getFirstName(),
                lastName: this.getUser().getLastName(),
                gender: this.getUser().getGender(),
            },
        };
    }

    getUser() {
        return this.props.user;
    }

    closeModal() {
        Modal.close();
    }

    onSuccess(result) {
        if (_.isFunction(this.props.onNameChange)) {
            this.props.onNameChange(result);
        }

        this.getApplication().reloadUser();
    }

    onSubmit(data) {
        const userId = this.getUser().getId();
        const users = this.getApplication().getNetwork().service('users');

        users.patch(userId, {
            'profile.firstName': data.firstName,
            'profile.lastName': data.lastName,
            'profile.gender': data.gender
        }).then((result) => {
            this.stop();
            this.onSuccess(result);
            this.closeModal();
        }).catch((e) => {
            console.dir(e);
            this.stop();
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
                    title={t('Name')}
                    subtitle={t('Do you want to change something?')}
                    submitText={t('Save')}
                    onCloseClick={this.closeModal.bind(this)}
                    ref={(ref) => { this._form = ref; }}
                >
                    <FormRow>
                        <FormSelect
                            label={t('Salutation')}
                            name="gender"
                            options={genderEnum.selectizeSimple()}
                            multiple={false}
                        />
                    </FormRow>
                    <FormRow>
                        <FormInput
                            label={t('First name')}
                            name="firstName"
                            inputClassName="field"
                            feedbackable={false}
                        />
                    </FormRow>
                    <FormRow>
                        <FormInput
                            label={t('Last name')}
                            name="lastName"
                            inputClassName="field"
                            feedbackable={false}
                        />
                    </FormRow>
                </Form>
            </CustomForm>
        );
    }
}

export default AccountName.connect({
    store: store => store.global,
    context: true,
});
