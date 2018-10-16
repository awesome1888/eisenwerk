import React          from 'react';
import connectField   from 'uniforms/connectField';
import filterDOMProps from 'uniforms/filterDOMProps';

import BaseComponent from '../../../../../../lib/ui/component/index.jsx';
import ConfirmModal from '../../../../confirm-modal/confirm-modal.jsx';

class ListDelete extends BaseComponent {

    onClick() {
        if (this.props.useConfirmation) {
            ConfirmModal.open({
                isModal: true,
                onConfirmClick: this.onDeleteConfirmed.bind(this),
                cancelButtonLabel: 'Löschen',
                cancelButtonClass: 'button_red-alert',
                text: (this.props.confirmationText || ''),
            });
        } else {
            this.deleteItem();
        }
    }

    onDeleteConfirmed() {
        ConfirmModal.close();
        this.deleteItem();
    }

    deleteItem() {
        const name = this.props.name;
        const parent = this.props.parent;

        const fieldIndex = +name.slice(1 + name.lastIndexOf('.'));
        const limitNotReached = !this.props.disabled && !(parent.minCount >= parent.value.length);

        if (limitNotReached) {
            parent.onChange([]
                .concat(parent.value.slice(0, fieldIndex))
                .concat(parent.value.slice(1 + fieldIndex))
            );
        }
    }

    render() {
        filterDOMProps.register('useConfirmation', 'confirmationText');

        return (
            <div
                {...filterDOMProps(this.props)}
                onClick={this.onClick.bind(this)}
            />
        );
    }
}

export default connectField(ListDelete, {includeParent: true, initialValue: false});
