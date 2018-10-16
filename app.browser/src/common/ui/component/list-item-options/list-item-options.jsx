import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import BaseComponent from '../../../lib/ui/component/index.jsx';

import './style.less';

export default class ListItemOptions extends BaseComponent {

    _scope = null;
    _dropdown = null;
    static propTypes = {
        options: PropTypes.array,
    };

    static defaultProps = {
        options: [],
        dropdown: true
    };

    constructor(props) {
        super(props);
        this.state = {
            isOpened: false
        };
    }

    componentDidMount() {
        this.onDocumentClick = this.onDocumentClick.bind(this);

        $(window.document).on('click', this.onDocumentClick);
    }

    componentWillUnmount() {
        $(window.document).off('click', this.onDocumentClick);
    }

    onDocumentClick(e) {
        let node = e.target;
        while (node) {
            if (node === this._scope || node === this._dropdown) {
                return;
            }

            node = node.parentElement;
        }

        this.closeDropDown();
    }

    closeDropDown() {
        if (this.state.isOpened) {
            this.setState({
                isOpened: false,
            });
        }
    }

    isOpened() {
        return this.state.isOpened;
    }

    toggleContent() {
        let newState = true;
        if (this.isOpened()) {
            newState = false;
        }
        this.setState({
            isOpened: newState
        });
    }

    onOptionClick(handler) {
        if (_.isFunction(handler)) {
            handler();
        }
        this.closeDropDown();
    }

    getOptions() {
        return this.props.options || [];
    }

    renderDropdown() {
        const className = classnames(
            this.props.className,
            {
                'item-options': true,
                'item-options_dropdown': true,
                'item-options_show': this.isOpened()
            }
        );

        return (
            <div
                className={className}
                ref={(ref) => { this._scope = ref; }}
            >
                <div className="item-options__icon" onClick={this.toggleContent.bind(this)} />
                <div
                    className="item-options__dropdown"
                    ref={(ref) => { this._dropdown = ref; }}
                >
                    {
                        this.getOptions().map((item) => {
                            return (
                                <div key={item.label}>
                                    {
                                        item.handler &&
                                        <div
                                            className="item-options__dropdown-item"
                                            onClick={this.onOptionClick.bind(this, item.handler)}
                                        >
                                            {item.label}
                                        </div>
                                    }
                                    {
                                        item.url &&
                                        <a
                                            className="item-options__dropdown-item"
                                            href={item.url}
                                            target="_blank"
                                            onClick={this.closeDropDown.bind(this)}
                                        >
                                            {item.label}
                                        </a>
                                    }
                                </div>
                            );
                        })
                    }
                </div>
            </div>
        );
    }

    renderList() {
        return (
            <div className="item-options item-options_list">
                {
                    this.getOptions().map((item) => {
                        return (
                            <span key={item.label}>
                                {
                                    item.handler &&
                                    <span
                                        className="item-options__list-item"
                                        onClick={this.onOptionClick.bind(this, item.handler)}
                                    >
                                        {item.label}
                                    </span>
                                }
                                {
                                    item.url &&
                                    <a
                                        className="item-options__list-item"
                                        href={item.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={this.closeDropDown.bind(this)}
                                    >
                                        {item.label}
                                    </a>
                                }
                            </span>
                        );
                    })
                }
            </div>
        );
    }

    render() {
        if (!_.isArrayNotEmpty(this.getOptions())) {
            return null;
        }

        if (this.props.dropdown) {
            return this.renderDropdown();
        } else {
            return this.renderList();
        }
    }
}
