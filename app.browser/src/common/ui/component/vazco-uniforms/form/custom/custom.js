import cloneDeep from 'lodash.clonedeep'; //eslint-disable-line
import isEqual from 'lodash.isequal'; //eslint-disable-line
import set from 'lodash.set'; //eslint-disable-line
// import PageScroll from '../../../../../lib/util/page-scroll/page-scroll.js';
// import {PropTypes} from 'react';

import ValidatedQuickForm from 'uniforms-unstyled/ValidatedQuickForm';

const Auto = parent => class Custom extends parent {
    // static Auto = Auto;
    // static displayName = `Auto${parent.displayName}`;

    // static propTypes = {
    //     ...parent.propTypes,
    //     onChangeModel: PropTypes.func
    // };

    scrollToElement(error) {
        const errorElName = _.getValue(error, 'details[0].name');
        if (errorElName) {
            this.scrollToError();
        }
    }

    scrollToError() {
        // const $el = $('.has-error');
        // if ($el && $el.offset()) {
        //     PageScroll.scrollTo($el.offset().top - 50);
        // }
    }

    constructor() {
        super(...arguments);// eslint-disable-line

        this.state = {
            ...this.state,
            model: this.props.model,
            modelSync: this.props.model
        };
    }

    componentWillReceiveProps({model}) {
        super.componentWillReceiveProps(...arguments);// eslint-disable-line

        if (!isEqual(this.props.model, model)) {
            this.setState({model, modelSync: model});
        }
    }

    getNativeFormProps() {
        const {
            onChangeModel, // eslint-disable-line no-unused-vars
            ...props
        } = super.getNativeFormProps();
        delete props.draftSave;
        return props;
    }

    getModel(mode) {
        return mode === 'form' ? this.state.modelSync : this.state.model;
    }

    onChange(key, value) {
        this.setState(state => ({modelSync: set(cloneDeep(state.modelSync), key, value)}), () => {
            super.onChange(...arguments);// eslint-disable-line
            this.setState({model: this.state.modelSync}, () => {
                if (this.props.onChangeModel) {
                    this.props.onChangeModel(this.state.model);
                }
            });
        });
    }

    onReset() {
        this.setState(() => {
            super.onReset();

            return {
                model: this.props.model,
                modelSync: this.props.model
            };
        });
    }

    onSubmit(event) {
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }

        return new Promise(resolve =>
            this.setState({validate: true}, () =>
                resolve(this.onValidate().then(
                    () => super.onSubmit(),
                    (err) => {
                        console.dir(err);

                        const className = this.props.className;
                        if (className && className.indexOf('js-not-scrollable') === -1) {
                            this.scrollToElement(err);
                        }
                    }
                ))));
    }

    onValidate() {
        if (this.props.draftSave) {
            const model = this.getChildContextModel();
            const isValidData = this.props.schema.namedContext().validate(model);
            if (!isValidData) {
                this.props.draftSave(model);
            }
        }

        return this.onValidateModel(this.getChildContextModel());
    }
};

export default Auto(ValidatedQuickForm);
