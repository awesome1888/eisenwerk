import React from 'react';
import BaseComponent from '../../../common/lib/ui/component/index.jsx';

import PageDefault from '../../../common/ui/component/page-default/page-default.jsx';
import genderEnum from '../../../common/entity/user/enum/gender.enum.js';
import './style.less';
import Modal from '../../../common/ui/component/modal/modal-controller.js';
import AccountName from './component/account-name/account-name.jsx';
import AccountEmail from './component/account-email/account-email.jsx';
import AccountPassword from './component/account-password/account-password.jsx';
import roleEnum from './../../../common/lib/enum/role.js';

class Account extends BaseComponent {

    constructor(props) {
        super(props);

        this.state = {
            model: {}
        };
    }

    componentDidMount() {
        this.setModel();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.user !== this.props.user) {
            this.setModel();
        }
    }

    getUser() {
        return this.props.user;
    }

    getData() {
        const user = this.getUser();
        if (!_.isEmpty(user)) {
            return user.getData();
        }
        return {};
    }

    setModel(user = {}) {
        if (_.isEmpty(user)) {
            user = this.getData();
        }

        if (!_.isEmpty(user)) {
            this.setState({
                model: {
                    firstName: _.getValue(user, 'profile.firstName'), // user.getFirstName(),
                    lastName: _.getValue(user, 'profile.lastName'), // user.getLastName(),
                    email: _.getValue(user, 'profile.email'), // user.getEmail(),
                },
            });
        }
    }

    getFullName() {
        const model = this.state.model;
        if (!_.isEmpty(model)) {
            let gender = '';
            if (genderEnum.hasValue(model.gender)) {
                gender = `${genderEnum.getValueByKey(model.gender)} `;
            }
            return `${gender} ${model.firstName}  ${model.lastName}`.trim();
        }
        return '';
    }

    getEmail() {
        const model = this.state.model;
        if (!_.isEmpty(model)) {
            return model.email;
        }
        return '';
    }

    getItems() {
        return [{
            icon: 'icon_person',
            title: t('Name'),
            text: this.getFullName(),
            onClick: this.openNameModal.bind(this),
        },
        {
            icon: 'icon_email',
            title: t('Email address'),
            text: this.getEmail(),
            onClick: this.openEmailModal.bind(this),
        },
        {
            icon: 'icon_lock',
            title: t('Password'),
            text: '• • • • • • • •',
            onClick: this.openPasswordModal.bind(this),
        }];
    }

    renderItem(item) {
        return (
            <div className="account-block__item" key={item.title} onClick={item.onClick}>
                <div className="margin">
                    <a
                        className="account-block__item-content"
                    >
                        <span
                            className={`account-block__item-logo ${item.icon}`}
                        >
                            &nbsp;
                        </span>

                        <div
                            className="account-block__item-title"
                        >
                            {item.title}
                        </div>
                        <div className="account-block__item-text">
                            {item.text}
                        </div>
                    </a>
                </div>
            </div>
        );
    }

    openNameModal() {
        const props = {
            onNameChange: (data) => {
                //  We make the page reactive so after you change your name it will also show without the need of refresh
                this.setModel(data);
            }
        };

        Modal.open(<AccountName {...props} />, {}, { size: 'S' });
    }

    openEmailModal() {
        const props = {
            onEmailChange: (data) => {
                //  We make the page reactive so after you change your name it will also show without the need of refresh
                this.setModel(data);
            }
        };

        Modal.open(<AccountEmail {...props} />, {}, { size: 'S' });
    }

    openPasswordModal() {
        Modal.open(<AccountPassword />, {}, { size: 'S' });
    }

    render() {
        const items = this.getItems();

        return (
            <div className="block-stack">
                <div className="data-block__content-form">
                    <PageDefault
                        title={t('Account')}
                        subtitle={t('Do you want to change something?')}
                    >
                        <div className="account-block">
                            {
                                _.map(items, (item, index) => this.renderItem(item, index))
                            }
                        </div>
                    </PageDefault>
                </div>
            </div>
        );
    }
}

export default Account.connect({
    store: store => store.global,
});
