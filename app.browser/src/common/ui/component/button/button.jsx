import React from 'react';
import PropTypes from 'prop-types';

import './style.less';

export default class Button extends React.Component {
    _timer = null;

    static propTypes = {
        startOnClick: PropTypes.bool,
        lockOnClick: PropTypes.bool,
    };

    static defaultProps = {
        startOnClick: true,
        lockOnClick: true,
    };

    _locked = false;

    constructor() {
        super();
        this.state = {
            isLoading: false,
        };
    }

    start() {
        if (!this._timer) {
            this._timer = setTimeout(() => {
                this.setState({
                    isLoading: true,
                });
                this.clearTimer();
            }, 150);
        }
    }

    clearTimer() {
        clearTimeout(this._timer);
        this._timer = null;
    }

    stop() {
        this.clearTimer();
        this.setState({
            isLoading: false,
        });
    }

    lock() {
        this._locked = true;
    }

    unLock() {
        this._locked = false;
    }

    complete() {
        this.unLock();
        this.stop();
    }

    onClick(...params) {
        if (this.props.lockOnClick) {
            if (this._locked) {
                return;
            }
            this.lock();
        }

        if (this.props.startOnClick) {
            this.start();
        }
        if (_.isFunction(this.props.onClick)) {
            params.push(this);

            this.props.onClick(...params);
        }
    }

    render() {
        return (
            <button
                onClick={this.onClick.bind(this)}
                className={`button button_loader ${this.props.className} ${this.state.isLoading ? 'button_loading' : ''}`}
                type={this.props.type}
            >
                <span className="button__inner">
                    <span className="button__inner-spinner" />
                    <span className="button__inner-text">
                        {
                            this.props.children
                        }
                    </span>
                </span>
            </button>
        );
    }
}
