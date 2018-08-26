import React from 'react';
import PropTypes from 'prop-types';
import Modal from './reactjs-popup.js';

import BaseComponent from '../../../../../lib/ui/component/index.jsx';
import './style.less';

export default class ModalFrame extends BaseComponent {

    static propTypes = {
        lockScroll: PropTypes.bool,
        opened: PropTypes.bool,
        onClose: PropTypes.func,
        size: PropTypes.string,
        closeOnDocumentClick: PropTypes.bool,
        closeOnEscape: PropTypes.bool,
    };


    static defaultProps = {
        lockScroll: false,
        opened: true,
        onClose: null,
        size: 'L',
        closeOnDocumentClick: true,
        closeOnEscape: true,
    };

    onOpen() {
        console.dir('1111');

        $('body').addClass('rb-no-overflow');
        if (_.isFunction(this.props.onOpen)) {
            this.props.onOpen.apply(this, []);
        }
    }

    onClose() {
        console.dir('2222');
        $('body').removeClass('rb-no-overflow');
        if (_.isFunction(this.props.onClose)) {
            this.props.onClose.apply(this, []);
        }
    }

    getSizeClass() {
        if (this.props.size === 'XL') {
            return 'modal_xlarge';
        }

        if (this.props.size === 'M') {
            return 'modal_medium';
        }

        if (this.props.size === 'S') {
            return 'modal_small';
        }

        return 'modal_large';
    }

    render() {
        if (!this.props.opened) {
            return null;
        }

        return (
            <Modal
                open
                onClose={this.onClose.bind(this)}
                onOpen={this.onOpen.bind(this)}
                lockScroll={this.props.lockScroll}
                closeOnDocumentClick={this.props.closeOnDocumentClick}
                closeOnEscape={this.props.closeOnEscape}
                className={`modal ${this.getSizeClass()}`}
                contentStyle={{ padding: 0, border: 0, width: 'auto' }}
            >
                <div className="modal-content">
                    {this.props.children}
                </div>
            </Modal>
        );
    }
}
