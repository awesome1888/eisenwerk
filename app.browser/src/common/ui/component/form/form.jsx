import React from 'react';
import BaseComponent from '../../../lib/ui/component/index.jsx';
import Button from '../button/button.jsx';
import PageDefault from '../page-default/page-default.jsx';

export default class Form extends BaseComponent {

    stopSubmitButton() {
        this._submitButton.complete();
    }

    renderFormContents(props) {
        return (
            <PageDefault
                title={props.title}
                subtitle={props.subtitle}
            >
                {props.children}
            </PageDefault>
        );
    }

    onBackClick() {
        if (_.isFunction(this.props.onBackClick)) {
            this.props.onBackClick();
        }
        // this.redirectTo(this.props.backUrl);
    }

    onCloseClick(...a) {
        if (_.isFunction(this.props.onCloseClick)) {
            this.props.onCloseClick(...a);
        }
    }

    onDeleteClick(...a) {
        if (_.isFunction(this.props.onDeleteClick)) {
            this.props.onDeleteClick(...a);
        }
    }

    onCustomButtonClick(...a) {
        if (_.isFunction(this.props.onCustomButtonClick)) {
            this.props.onCustomButtonClick(...a);
        }
    }

    onValidate(data, error, cb) {
        if (error && error.error === 'validation-error') {
            this._submitButton.complete();
        }
        return cb();
    }

    renderDeleteButton() {
        return (
            <div className="data-block">
                <div className="margin-top_double">
                    <div className="group_inline_x2 group_vertical_inline flex">
                        {
                            _.isFunction(this.props.onDeleteClick) &&
                            <a
                                className="button-erase"
                                onClick={this.onDeleteClick.bind(this)}
                            >
                                {t('Delete')}
                            </a>
                        }
                        {
                            this.props.extraTextButtons
                        }
                    </div>
                </div>
            </div>
        );
    }

    renderFormButtons() {
        return (
            <div className="data-block">
                <div className="margin-top_double">
                    <div className="group_inline_x2 group_vertical_inline flex">
                        {
                            this.props.onBackClick
                            &&
                            <a
                                className="button button_back"
                                onClick={this.onBackClick.bind(this)}
                            >
                                {t('Back')}
                            </a>
                        }
                        {
                            _.isFunction(this.props.onCloseClick)
                            &&
                            <a
                                className="button button_back"
                                onClick={this.onCloseClick.bind(this)}
                            >
                                {t('Close')}
                            </a>
                        }
                        {
                            this.props.customButtonText &&
                            <Button
                                className={this.props.customButtonClass}
                                onClick={this.onCustomButtonClick.bind(this)}
                            >
                                {this.props.customButtonText}
                            </Button>
                        }
                        {
                            this.props.submitText &&
                            <Button
                                className="button button_blue"
                                type="submit"
                                ref={(ref) => { this._submitButton = ref; }}
                            >
                                {this.props.submitText}
                            </Button>
                        }
                    </div>
                </div>
            </div>
        );
    }

    render() {
        return (
            <div className={this.props.className}>
                {this.renderFormContents(this.props)}
                {
                    (_.isFunction(this.props.onDeleteClick)
                        || this.props.extraTextButtons) &&
                    this.renderDeleteButton()
                }
                {
                    !this.props.noButtons &&
                    this.renderFormButtons()
                }
            </div>
        );
    }
}
