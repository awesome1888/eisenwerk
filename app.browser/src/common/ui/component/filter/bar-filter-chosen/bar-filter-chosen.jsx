import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class BarFilterModal extends Component {

    static propTypes = {
        items: PropTypes.array,
        onReset: PropTypes.func,
        onResetAll: PropTypes.func,
        className: PropTypes.string
    };

    static defaultProps = {
        items: [],
        onReset: null,
        onResetAll: null,
        className: ''
    };

    getItems() {
        return this.props.items || [];
    }

    onResetHandle(field, value) {
        if (_.isFunction(this.props.onReset)) {
            this.props.onReset(field, value);
        }
    }

    onResetAllHandle() {
        if (_.isFunction(this.props.onResetAll)) {
            this.props.onResetAll();
        }
    }

    render() {
        const items = this.getItems();
        return (
            <div className={`navbar-filter__modal-block margin-bottom ${this.props.className}`}>
                <div className="navbar-filter__modal-block__title text-uppercase" onClick={this.onResetAllHandle.bind(this)}>
                    {t('Active Filters ($(0))', items.length)}
                </div>
                <div className="navbar-filter__reset-all" onClick={this.onResetAllHandle.bind(this)} />
                <div className="navbar-filter__modal-block__content">
                    {
                        items.length === 0
                        &&
                        <div className="text_size_normal padding-half">{t('No filters selected')}</div>
                    }
                    {
                        items.length > 0
                        &&
                        <div className="navbar-filter__reset-block">
                            {
                                items.map((el) => {
                                    return (
                                        <div
                                            className="navbar-filter__reset-item"
                                            key={`${el.field}_${el.key}`}
                                            onClick={this.onResetHandle.bind(this, el.field, el.key)}
                                        >
                                            <span className="icon icon_close" />
                                            {el.value}
                                        </div>
                                    );
                                })
                            }
                        </div>
                    }
                </div>
            </div>
        );
    }
}
