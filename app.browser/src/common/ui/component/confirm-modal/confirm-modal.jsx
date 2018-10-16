import React from 'react';
import BaseComponent from '../../../lib/ui/component/index.jsx';
import Modal from '../modal/modal-controller.js';
import PropTypes from 'prop-types';
import Form from '../form/form.jsx';

export default class ConfirmModal extends BaseComponent {

    static propTypes = {
        text: PropTypes.object,
        cancelButtonLabel: PropTypes.string,
        cancelButtonClass: PropTypes.string,
        headerText: PropTypes.string,
        onConfirmClick: PropTypes.func,
        onClose: PropTypes.func,
        // hideCloseButton: PropTypes.boolean
    };

    static defaultProps = {
        text: null,
        cancelButtonLabel: 'Confirm',
        cancelButtonClass: 'button_blue',
        headerText: 'Achtung!',
        onConfirmClick: null,
        // hideCloseButton: false
    };

    static open(...params) {
        Modal.open(this, ...params);
    }

    static close() {
        Modal.close();
    }

    constructor(props) {
        super(props);
        this.state = {
        };
    }

    close() {
        Modal.close();
        if (_.isFunction(this.props.onClose)) {
            this.props.onClose();
        }
    }

    onConfirmClick(p, button) {
        if (_.isFunction(this.props.onConfirmClick)) {
            this.props.onConfirmClick({
                modal: this,
                button
            });
        }
        Modal.close();
    }

    render() {
        return (
            <Form
                title={this.props.headerText}
                subtitle={this.props.text}
                onCloseClick={!this.props.hideCloseButton && this.close.bind(this)}
                customButtonText={this.props.cancelButtonLabel}
                customButtonClass={this.props.cancelButtonClass}
                onCustomButtonClick={this.onConfirmClick.bind(this)}
            />
        );
    }
}
