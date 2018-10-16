import React from 'react';
import Select from '../select/select.jsx';
import classnames from 'classnames';

export default class SelectCompact extends Select {

    renderClassName() {
        return `hack__controls-deface selectbox-compact  ${!this.isOpened() ? 'selectbox-compact_closed' : 'selectbox-compact_opened'} ${this.isFocused() ? 'selectbox-compact_focused' : ''} selectbox-compact_adaptive ${this.isDisabled() ? 'selectbox-compact_disabled' : ''} ${this.props.className}`;
    }

    render() {
        const className = classnames('selectbox-compact__placeholder', {
            'selectbox-compact__placeholder_mode-transparent hover-menu': !!this.props.transparent,
        });

        const options = this.getDisplayedOptions();
        const value = this.getNormalizedValue();

        return (
            <div className={this.renderClassName()}>
                <div
                    className={className}
                    ref={(ref) => { this._scope = ref; }}
                    onClick={this.onContainerClick.bind(this)}
                >
                    <div
                        className="selectbox-compact__placeholder-text"
                    >
                        {this.getPlaceHolder()}
                    </div>
                    <div className="selectbox-compact__placeholder-arrow" />
                </div>
                {
                    options.isNotEmpty()
                    &&
                    <div
                        className={`selectbox-compact__dropdown ${this.isUp() ? 'selectbox-compact__dropdown_up' : ''} ${!this.isOpened() ? 'display-none' : ''}`}
                        ref={(ref) => { this._dropdown = ref; }}
                    >
                        {
                            options.map((el) => {
                                if (el.value !== null && el.enabled !== false) {
                                    return (
                                        <label
                                            className={`${this.getNormalizedValue()} ${el.key} selectbox-compact__dropdown-item selectbox-compact__dropdown-item-id_${this.prepareValue(el.key)} ${this.isValueSelected(el.key) ? 'selectbox-compact__dropdown-item_selected' : ''}`}
                                            key={el.value}
                                        >
                                            <input
                                                type="radio"
                                                onChange={this.handleSingle.bind(this, el.value, el.key)}
                                                checked={value === el.key}
                                                name={this.props.name}
                                                value={el.key}
                                            />
                                            {this.wrapListItem(el)}
                                        </label>
                                    );
                                }

                                return null;
                            })
                        }
                    </div>
                }
            </div>
        );
    }
}
