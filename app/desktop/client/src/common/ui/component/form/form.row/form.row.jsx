import React from 'react';

export default class FormRow extends React.Component {
    getMargin() {
        if (this.props.noMargin) {
            return '';
        }
        return this.props.simple ? 'group_vertical_inline' : 'group_vertical_inline_double';
    }
    render() {
        const extraClass = this.props.columns === 2 && 'group_horizontal_half';
        return (
            <div className="form__row">
                <div className={`grid-x ${this.getMargin()} ${extraClass} ${this.props.innerClass}`}>
                    {this.props.children}
                </div>
            </div>
        );
    }
}
