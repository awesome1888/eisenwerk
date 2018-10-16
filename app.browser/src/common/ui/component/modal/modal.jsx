import React from 'react';
import ModalFrame from './component/modal-frame/modal-frame.jsx';
import EventEmitter from '../../../lib/util/event/event.js';

export default class ModalController extends React.Component {
    constructor() {
        super();
        this.state = {
            isOpened: false
        };
        this.registerEventEmitters();
    }

    registerEventEmitters() {
        // register an event emmiter to receive messages to open modal
        EventEmitter.on('open-modal', (...params) => {
            this._openModal(...params);
        });

        // register an event emmiter to receive messages to close modal
        EventEmitter.on('close-modal', () => {
            this._closeModal();
        });
    }

    _openModal(pageInstance, pageParams = {}, modalParams = {}) {
        this.setState({
            isOpened: true,
            pageInstance,
            pageParams,
            modalParams
        });
    }

    _closeModal() {
        if (!this.state.isOpened) {
            return;
        }

        this.setState({
            isOpened: false,
            pageInstance: null,
            pageParams: null,
            modalParams: null
        });

        const onClose = _.getValue(this.state, 'modalParams.onModalClose');
        if (_.isFunction(onClose)) {
            onClose();
        }
    }

    renderModal() {
        return React.createElement(ModalFrame, Object.assign({}, {
            opened: this.state.isOpened,
            onClose: this._closeModal.bind(this),
        }, this.state.modalParams), this.renderPageContent());
    }

    renderPageContent() {
        const component = this.state.pageInstance;

        if (React.isValidElement(component)) {
            return component;
        } else if (_.isObject(component)) {
            return React.createElement(
                component,
                this.state.pageParams
            );
        } else {
            return null;
        }
    }

    render() {
        return (
            <div>
                {
                    this.state.isOpened &&
                    this.renderModal()
                }
            </div>
        );
    }
}
