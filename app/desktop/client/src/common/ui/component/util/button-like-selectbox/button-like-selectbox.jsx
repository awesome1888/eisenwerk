import React from 'react';
import Util from '../../../../lib/util/index.js';

export default class ButtonLikeSelectbox extends React.Component {

    onClick() {
        if (_.isFunction(this.props.onClick)) {
            this.props.onClick();
        }
    }

    getValue() {
        return this.props.value;
    }

    renderValue() {
        let v = this.getValue();
        let display = null;

        if (_.isArrayNotEmpty(v)) {
            if (v.length === 1) {
                display = v[0];
                if (_.isFunction(this.props.onRenderValue)) {
                    display = this.props.onRenderValue(display);
                }
            } else {
                v = _.deepClone(v);

                if (_.isFunction(this.props.onRenderValue)) {
                    v = v.map(this.props.onRenderValue);
                }

                if (this.props.enableResort !== false) {
                    v.sort(Util.getAlphabeticalComparator());
                }

                display = `${v[0]} +${v.length - 1}`;
            }
        } else if (_.isStringNotEmpty(v)) {
            display = v;
        }

        if (_.isFunction(this.props.onValueRender)) {
            display = this.props.onValueRender(v);
        }

        if (!_.isStringNotEmpty(display)) {
            display = this.props.placeholder || '';
        }

        return display;
    }

    getClassNameIcon() {
        return _.isStringNotEmpty(this.props.classNameIcon) ? this.props.classNameIcon : 'icon_open-in-new';
    }

    render() {
        return (
            <div className="hack__controls-deface button-like-selectbox button-like-selectbox_icon">
                <div
                    className="button-like-selectbox__area"
                    onClick={this.onClick.bind(this)}
                >
                    <div className="button-like-selectbox__placeholder">
                        {this.renderValue()}
                        <div className={`button-like-selectbox__icon button-like-selectbox__icon ${this.getClassNameIcon()}`} />
                    </div>
                </div>
                <input type="hidden" name={this.props.name} />
            </div>
        );
    }
}
