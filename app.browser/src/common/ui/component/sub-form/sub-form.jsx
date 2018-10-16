/* eslint-disable react/no-array-index-key */

import React from 'react';
import BaseComponent from '../../../lib/ui/component/index.jsx';
import FCS from '../../../lib/util/form-control-system/form-control-system.js';
import PageScroll from '../../../lib/util/page-scroll/page-scroll.js';

import Button from '../button/button.jsx';
import CustomForm from '../vazco-uniforms/form/custom/custom.js';

import Modal from '../modal/modal-controller.js';
import Model from './model.js';

import CandidateEntity from '../../../entity/user/entity/client.js';

import PropTypes from 'prop-types';
import ConfirmModal from '../confirm-modal/confirm-modal.jsx';


export default class SubForm extends BaseComponent {

    static propTypes = {
        doSave: PropTypes.bool,
        setTitle: PropTypes.bool,
        goBack: PropTypes.bool,
        onReturnBack: PropTypes.func,
        section: PropTypes.string,
        item: PropTypes.string,
    };

    static defaultProps = {
        doSave: true,
        setTitle: true,
        goBack: true,
        onReturnBack: null,
        section: '',
        item: '',
    };

    _submitButton = null;

    constructor(props) {
        super(props);
        const initialModel = this.makeInitialModel();

        this.state = {
            initialModel,
            model: _.deepClone(initialModel, false),
            ...this.getInitialState()
        };
    }

    componentWillMount() {
        this.getFCS().onMount(); // mount function on event

        if (this.useTitle()) {
            this.setTitle(this.getTitle());
        }
    }

    componentDidMount() {
        super.componentDidMount();
        PageScroll.scrollTo();
    }

    componentWillUnmount() {
        this.getFCS().onUnmount(); // remove function from event
    }

    getInitialState() {
        return {};
    }

    getFCS() {
        if (!this._fcs) {
            this._fcs = new FCS();
        }

        return this._fcs;
    }

    getModelController() {
        return Model;
    }

    getSchema() {
        return null;
    }

    makeInitialModel() {
        return this.getModelController().makeSubModel(this.getData(), this.props);
    }

    getModel() {
        return this.state.model;
    }

    getInitialModel() {
        return this.state.initialModel;
    }

    getData() {
        return this.props.data || null;
    }

    getService() {
        return null;
    }

    getTitle() {
        return 'Sub-section';
    }

    useTitle() {
        return this.props.setTitle;
    }

    getId() {
        const d = this.getData();
        if (d) {
            return d.getId();
        }

        return null;
    }

    openInModal(element, params = {}, args = {}, bindParams = {}) {
        Modal.open(element, {
            doSave: false,
            setTitle: false,
            goBack: false,
            onReturnBack: () => {
                Modal.close();
            },
            onSubmit: () => {
                // we dont know which fields were changed from outside, so just say
                // that everything was changed
                this.emulateChangeAll();
                // this.forceUpdate();
                if (_.isObjectNotEmpty(bindParams) && _.isFunction(bindParams.onSubmit)) {
                    bindParams.onSubmit(this.getModel());
                }
            },
            data: this.getModel(),
            ...params
        }, {
            usePadding: false,
            ...args
        });
    }

    emulateChangeAll() {
        const model = _.deepClone(this.getModel());
        this.getSchema()._firstLevelSchemaKeys.forEach((key) => {
            this._form.change(key, model[key]);
        });
    }

    /**
     * Call one of company profile update methods
     * @param {{}} data
     * @returns void
     * @access protected
     */
    submitForm(data) {
        this.updateSource(data);
        this.touch();
        this.populate().then(() => {
            if (this.props.doSave) {
                this.save().catch((err) => {
                    this.stop();
                    this.responseCallQuery(err);
                });
            } else {
                this.stop();

                if (_.isFunction(this.props.onSubmit)) {
                    this.props.onSubmit();
                }
                this.returnBack();
            }
        });
    }

    touch() {
        if (this.getData() instanceof this.getEntity() && _.isFunction(this.getData().setModificationDate)) {
            this.getData().setModificationDate(new Date());
        }
    }

    async populate() {
        if (this.getData() instanceof this.getEntity()) {
            return this.getData().populate();
        }

        return true;
    }

    getCallQueryParameters() {
        return {};
    }

    // treat received data
    responseCallQuery() {
    }

    getDataToSave() {
        return this.getData().getData();
    }

    save() {
        const service = this.getService();

        if (service) {
            return service.patch(this.getId(), this.getDataToSave())
                .then((res) => {
                    // console.dir(res);
                    this.stop();

                    if (_.isFunction(this.props.onSubmit)) {
                        this.props.onSubmit();
                    }
                    if (!this.props.noGoingBack) {
                        this.returnBack();
                    }
                    return this.getData().populate();
                })
                .catch((e) => {
                    // console.dir(e);
                    this.stop();
                });
        }
        return null;
    }

    delete() {
        const service = this.getService();
        if (service) {
            return service.remove(this.getId())
                .then((res) => {
                    // console.dir(res);
                    this.stop();
                    if (_.isFunction(this.props.onSubmit)) {
                        this.props.onSubmit();
                    }
                    if (!this.props.noGoingBack) {
                        this.returnBack();
                    }
                })
                .catch((e) => {
                    // console.dir(e);
                    this.stop();
                });
        }
        return null;
    }

    updateSource(data, source = null) {
        if (!source) {
            source = this.getData();
        }
        this.getModelController().applySubModelToSource(data, source, this.props);
    }

    returnBack() {
        if (this.props.goBack) {
            this.props.history.push(this.getBackLink());
        }
        if (_.isFunction(this.props.onReturnBack)) {
            this.props.onReturnBack();
        }
    }

    onDeleteClick() {
        ConfirmModal.open({
            isModal: true,
            onConfirmClick: this.onDeleteConfirmed.bind(this),
            cancelButtonLabel: t('Confirm'),
            headerText: 'Are you sure?',
            text: t('This action cannot be undone.'),
        }, {
            size: 'S',
            showCloseButton: false
        });
    }

    onDeleteConfirmed() {
        ConfirmModal.close();
        this.onItemDelete();
    }

    onValidate(data, error, cb) {
        if (error) {
            console.error(error);
        }
        if (error && error.error === 'validation-error') {
            this.stop();
        }

        return cb();
    }

    onChangeModel(model) {
        // set actual model outside =/
        this.setState({
            model,
        });
    }

    onItemDelete() {
        this.getModelController().removeSubModelFromSource(this.getData(), this.props);

        if (this.props.doSave) {
            this.delete().catch((err) => {
                this.responseCallQuery(err);
                this.returnBack();
            });
        } else {
            this.returnBack();
        }
    }

    onModelTransform(/* model */) {
    }

    getEmitterName() {
        return 'candidate-edit';
    }

    getEntity() {
        return CandidateEntity;
    }

    treatBeforeEmit(data) {
        return data;
    }

    modelTransform(mode, transformModel) {
        this.onModelTransform(transformModel);

        if (mode === 'form') {
            this.getFCS().setDirty(this.getInitialModel(), transformModel);
        }

        return transformModel;
    }

    stop() {
        const b = this.getSubmitButton();
        if (b) {
            b.complete();
        }
    }

    getSubmitButton() {
        return this._submitButton;
    }

    getSubmitButtonTitle() {
        return (this.props.submitButtonTitle ? this.props.submitButtonTitle : t('Save'));
    }

    isExisting() {
        return _.isStringNotEmpty(this.getId());
    }

    isNewSubItem() {
        return this.props.item === 'new';
    }

    getBackLink() {
        return this.props.path.replace(':section', 'view').replace(':item', 'all');
    }

    onBackClick() {
        this.getFCS().confirmUnload().then(() => {
            this.returnBack();
        }).catch(x => x);
    }

    renderFormContents() {
        return null;
    }

    getReference() {
        return '';
    }

    needReference() {
        return React.isValidElement(this.getReference());
    }

    clearServerError(fieldName) {
        const errorMessage = this.state.errorMessage;
        errorMessage[fieldName] = null;
        this.setState({
            errorMessage
        });
    }

    isReady() {
        return true;
    }

    shouldHidePrevButton() {
        return this.props.hidePrevButton;
    }

    getFormClass() {
        return '';
    }

    render() {
        if (!this.isReady()) {
            return null;
        }

        return (
            <CustomForm
                model={this.getModel()}
                schema={this.getSchema()}
                label={false}
                showInlineError
                onSubmit={this.submitForm.bind(this)}
                onValidate={this.onValidate.bind(this)}
                onChangeModel={this.onChangeModel.bind(this)}
                className={`form data-block-stack hack__controls-deface ${this.getFormClass()}`}
                modelTransform={this.modelTransform.bind(this)}
                ref={(ref) => { this._form = ref; }}
            >
                {this.renderFormContents()}
                <div className="data-block">
                    <div className="data-block__content-form rb-padding-t_0">
                        <div className="group_inline_x2 group_vertical_inline flex">
                            {
                                !this.shouldHidePrevButton()
                                &&
                                <a
                                    className="button button_back"
                                    onClick={this.onBackClick.bind(this)}
                                >
                                    {t('Back')}
                                </a>
                            }
                            <Button
                                className="button button_blue"
                                type="submit"
                                ref={(ref) => { this._submitButton = ref; }}
                            >
                                {this.getSubmitButtonTitle()}
                            </Button>
                        </div>
                    </div>
                </div>
            </CustomForm>
        );
    }
}
