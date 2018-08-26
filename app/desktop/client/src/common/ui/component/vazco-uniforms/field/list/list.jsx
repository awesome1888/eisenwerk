import React, {Children} from 'react';
import classnames from 'classnames';
import connectField from 'uniforms/connectField';
import joinName from 'uniforms/joinName';
import ListAddField from 'uniforms-unstyled/ListAddField';
import ListDelete from './component/list-delete.jsx';
import DragNDrop from './drag-n-drop/drag-n-drop.js';
import clone from 'clone';

import BaseComponent from '../../../../../lib/ui/component/index.jsx';

import './style.less';

class List extends BaseComponent {
    _zone = null;

    static defaultProps = {
        showButtons: true
    };

    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        if (this.useDnD()) {
            this.getDNDController();
        }
    }

    componentWillUnmount() {
        if (this._dnd) {
            this._dnd.destroy();
            this._dnd = null;
        }
    }

    componentWillUpdate() {
        if (this.useDnD()) {
            this.getDNDController();
        }
    }

    getDNDController() {
        if (!this._dnd) {
            this._dnd = new DragNDrop({
                canDrag: this.canDrag.bind(this),
                canDrop: this.canDrop.bind(this),
                onReorder: this.onReorder.bind(this),
                zones: [
                    this._zone,
                ]
            });
        }

        return this._dnd;
    }

    canDrag(item) {
        return $(item).attr('data-dnd-type') === this.props.name;
    }

    canDrop(item, zone) {
        return zone.zone.attr('data-dnd-type') === $(item).attr('data-dnd-type');
    }

    onReorder(item, afterItem) {
        const ix = parseInt(item.attr('data-index'), 10);
        let aIx = -1;
        if (afterItem) {
            aIx = parseInt(afterItem.attr('data-index'), 10);
        }

        const value = this.props.value;
        const newValue = [];

        // console.dir(ix+' after '+aIx);
        // very smart code goes below
        if (aIx < 0) {
            newValue.push(clone(value[ix], false));
            value.forEach((vItem, i) => {
                if (i !== ix) {
                    newValue.push(clone(vItem, false));
                }
            });
        } else {
            value.forEach((vItem, i) => {
                if (i !== ix) {
                    newValue.push(clone(vItem, false));
                }
                if (i === aIx) {
                    newValue.push(clone(value[ix], false));
                }
            });
        }

        this.props.onChange(newValue);
    }

    getValue() {
        return this.props.value || [];
    }

    useDnD() {
        return this.getValue().length > 1 && !!this.props.useDnD;
    }

    getGroupClass() {
        return this.props.verticalSpaceClassName || 'rb-group_x2p25';
    }

    shouldFilterValues() {
        return !this.props.dontfilterValues;
    }

    render() {
        let value = this.getValue();
        // filter out undefined and null values...
        value = this.shouldFilterValues() ? value.filter(item => item !== undefined && item !== null) : value;
        const initialCount = parseInt(this.props.initialCount, 10);
        // try to show "remove" button by default
        let removeIcon = this.props.removeIcon;
        if (removeIcon === undefined) {
            removeIcon = true;
        }
        // but if we have less than or exact initialCount items, do not show remove button
        if (value.length <= initialCount) {
            removeIcon = false;
        }

        const under = this.props.removeButtonUnder;

        return (
            <div
                className={classnames(
                    'form__block uniforms-list-field',
                    {'form__block_has-errors': this.props.error},
                    this.props.className || ''
                )}
            >
                <div
                    className={classnames(
                        'form__block-inner',
                        this.props.innerClassName || ''
                    )}
                >
                    <div>
                        {
                            this.props.children
                            &&
                            <div
                                className={`uniforms-list-field__list ${this.getGroupClass()}`}
                                data-dnd-type={this.props.name}
                                ref={(ref) => { this._zone = ref; }}
                            >
                                {
                                    value.map((item, index) => {
                                        return (
                                            Children.map(
                                                this.props.children,
                                                (child) => {
                                                    const showDelete = this.props.showButtons && !this.props.removeLast && removeIcon;
                                                    return (
                                                        <div
                                                            className={
                                                                `${this.props.surroundingClass || ''} uniforms-list-field__item`
                                                            }
                                                            data-dnd-item
                                                            data-dnd-type={this.props.name}
                                                            data-index={index}
                                                            data-key={(item && item.__id) || item}
                                                            key={(item && item.__id) || item}
                                                        >
                                                            <div className="rb-relative">
                                                                {
                                                                    React.cloneElement(child, {
                                                                        key: (item && item.__id) || item,
                                                                        label: null,
                                                                        name: joinName(this.props.name, child.props.name && child.props.name.replace('$', index)),
                                                                        index,
                                                                        model: value[index] || {},
                                                                    })
                                                                }
                                                                {
                                                                    (this.props.afterFirst && index === 0)
                                                                    &&
                                                                    this.props.afterFirst
                                                                }
                                                                <div className="uniforms-list-field__button-panel">
                                                                    <div className="rb-content_row rb-group_x0p5">
                                                                        {
                                                                            !under && showDelete
                                                                            &&
                                                                            <ListDelete
                                                                                className="uniforms-list-field__delete"
                                                                                name={joinName(this.props.name, child.props.name && child.props.name.replace('$', index))}
                                                                                useConfirmation={this.props.useConfirmation}
                                                                                confirmationText={this.props.confirmationText}
                                                                            />
                                                                        }
                                                                        {
                                                                            this.useDnD()
                                                                            &&
                                                                            <div
                                                                                className="uniforms-list-field__drag-handle"
                                                                                data-dnd-item-handle
                                                                            />
                                                                        }
                                                                    </div>
                                                                </div>

                                                                {
                                                                    under && showDelete
                                                                    &&
                                                                    <div className="rb-margin-t_x">
                                                                        <ListDelete
                                                                            className="fab i_fab_color_dark fab_type_delete rb-float_right rb-margin-b_x rb-hand"
                                                                            name={joinName(this.props.name, child.props.name && child.props.name.replace('$', index))}
                                                                            useConfirmation={this.props.useConfirmation}
                                                                            confirmationText={this.props.confirmationText}
                                                                        />
                                                                    </div>
                                                                }

                                                            </div>
                                                        </div>
                                                    );
                                                }
                                            )
                                        );
                                    })
                                }
                            </div>
                        }
                        {
                            this.props.showButtons
                            &&
                            <div className={`uniforms-list-field__buttons ${under ? 'rb-padding-t_x' : ''}`}>
                                <ListAddField className={`fab i_fab_color_${this.props.invertedDesign ? 'blue' : 'gray'} fab_type_add`} name={`${this.props.name}.$`} initialCount={initialCount} />
                            </div>
                        }
                    </div>
                </div>
                {(this.props.error && this.props.errorMessage && this.props.showInlineError) && (
                    <span className="form__error form__block-error">
                        {this.props.errorMessage}
                    </span>
                )}
            </div>
        );
    }
}

export default connectField(List, {includeInChain: false});
