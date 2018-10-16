import React from 'react';
import PropTypes from 'prop-types';

import BaseComponent from './../../../../../lib/ui/component/index.jsx';
import ConfirmModal from '../../../confirm-modal/confirm-modal.jsx';

export default class ListItemFake extends BaseComponent {
    static propTypes = {
        showDelete: PropTypes.bool,
        onDelete: PropTypes.func,
    };

    static defaultProps = {
        showDelete: true,
        onDelete: null,
    };

    onDeleteClick() {
        ConfirmModal.open({
            isModal: true,
            onConfirmClick: this.onDeleteConfirmed.bind(this),
            cancelButtonLabel: t('Confirm'),
            // cancelButtonClass: 'button_red-alert',
            headerText: t('Are you sure?'),
            text: t('This action cannot be undone.'),
        });
    }

    onDeleteConfirmed() {
        ConfirmModal.close();

        if (_.isFunction(this.props.onDelete)) {
            this.props.onDelete();
        }
    }

    render() {
        return (
            <div className="form rb-relative">
                <div className="form__block uniforms-list-field">
                    <div className="form__block-inner">
                        <div>
                            {/* className="block_grey_resurrection" */}
                            {this.props.children}
                        </div>
                    </div>
                </div>

                {
                    this.props.showDelete
                    &&
                    <div className="uniforms-list-field__button-panel">
                        <div className="rb-content_row rb-group_x0p5">
                            <div
                                className="uniforms-list-field__delete"
                                onClick={this.onDeleteClick.bind(this)}
                            />
                        </div>
                    </div>
                }
            </div>
        );
    }
}
