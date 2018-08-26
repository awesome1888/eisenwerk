import React from 'react';
import BaseComponent from '../../../../../common/lib/ui/component/index.jsx';
import Authentication from '../../../../../common/ui/component/authentication/authentication.jsx';
import ConfirmModal from './../../../../../common/ui/component/confirm-modal/confirm-modal.jsx';
import OptionBar from './../../../option-bar/option-bar.jsx';
import StepEnum from './../..//enum/signup-step.enum.js';
import qs from 'query-string';
import { Redirect } from 'react-router-dom';
import './style.less';
import User from './../../../../../common/entity/user/entity/client.js';


class UserSignup extends BaseComponent {
    static getStoreMapper() {
        return state => state.global;
    }

    constructor() {
        super();
        this.state = {
        };
    }

    componentWillMount() {
        this.setData(this.getUser());
    }

    componentDidUpdate(prevProps) {
        if (prevProps.user !== this.props.user) {
            this.setData(this.getUser());
        }
    }

    getApplication() {
        return this.props.application;
    }

    getUser() {
        return this.props.user;
    }

    getInitialUrl() {
        return StepEnum.getValueByIndex(0);
    }

    getStep() {
        return this.props.step;
    }

    isAccount() {
        return this.getStep() === 'account';
    }

    getNextStep() {
        const key = StepEnum.getNext(this.getStep());
        return StepEnum.getByKey(key);
    }

    getPrevStep() {
        const key = StepEnum.getPrevious(this.getStep());
        return StepEnum.getByKey(key);
    }

    moveNext() {
        const next = this.getNextStep();

        const url = next.value || this.getInitialUrl();
        this.redirectTo(url);
    }

    movePrev() {
        const prev = this.getPrevStep();
        const url = prev.value || this.getInitialUrl();
        this.redirectTo(url);
    }

    onSignupFinish() {
        this.getApplication().reloadUser();
        this.openModal();
    }

    activateUser() {
        User.execute('candidate.activate', [this.getUser().getId()]).then(() => {
            this.onSignupFinish();
        }).catch((err) => {
            console.dir(err);
        });
    }

    onSaveStepSuccess() {
        const currentStepData = StepEnum.getByKey(this.getStep());
        const userId = this.getUser().getId();

        const data = {};
        if (currentStepData.index < 3) {
            data['data.signup.nextStep'] = currentStepData.index + 1;
        }

        this.getApplication().getNetwork().service('users')
            .patch(userId, data)
            .then((res) => {
                if (currentStepData.index < 3) {
                    this.moveNext();
                } else {
                    this.activateUser();
                }
            })
            .catch((e) => {
                console.dir(e);
            });
    }

    openModal() {
        ConfirmModal.open({
            isModal: true,
            cancelButtonLabel: "Let's start",
            headerText: 'Good job!',
            hideCloseButton: true,
            text: <div><div className="margin-bottom_half">Welcome to Seven Lanes and thank you for finishing our signup process. We will be in touch with you shortly to discuss any career opportunities that fit your expectations and background.</div><div>In the meantime, you can complete your profile to give us an even better basis for connecting you with employers.</div></div>,
        }, {
            size: 'S'
        });
    }

    renderContent() {
        const step = StepEnum.getByKey(this.getStep());

        if (!step) {
            return <Redirect to={this.getInitialUrl()} />;
        } else {
            const Controller = step.controller;
            return (
                <Controller
                    data={this.getData()}
                    onSubmit={this.onSaveStepSuccess.bind(this)}
                    noGoingBack
                    goBack={false}
                    onReturnBack={this.movePrev.bind(this)}
                    isSignup
                    {...step.params}
                />
            );
        }
    }

    renderCircles() {
        if (this.isAccount()) {
            return <div className="margin-top-negative_x2" />;
        }

        const TOTAL = 4;
        const step = StepEnum.getByKey(this.getStep());
        const index = step.index || 0;

        return (
            <div className="circles">
                {
                    _.times(TOTAL, it =>
                        <div
                            key={it}
                            className={`circle ${it === index && 'circle-checked'}`}
                        />
                    )
                }
            </div>
        );
    }

    renderFooter() {
        const queryParams = qs.parse(this.props.location.search);
        const params = {
            account: !this.isAccount() && `/signup/account?backUrl=${StepEnum.getValueByKey(this.getStep())}`,
            back: this.isAccount() && (queryParams.backUrl || this.getInitialUrl()),
            logout: true
        };

        return (
            <OptionBar {...params} />
        );
    }

    render() {
        return (
            <Authentication
                big
                header={this.renderCircles()}
                innerClass="margin-bottom_double-negative signup-block__container-fix"
                footer={this.renderFooter()}
            >
                {this.renderContent()}
            </Authentication>
        );
    }
}

export default UserSignup.connect({
    router: true,
    store: store => store.global,
    context: true,
});
