import React, {Component} from 'react';
import classnames from 'classnames';

import './style.less';

export default class Select extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isOpened: false
        };
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

    render() {
        const className = classnames({
            'collapse-block': true,
            show: this.isOpened()
        });
        const arrowClassName = classnames({
            'collapse-block__arrow_up': this.isOpened(),
            'collapse-block__arrow_down': !this.isOpened()
        });
        let style = {};

        if (this.isOpened()) {
            style = {
                transition: 'all 200ms ease-in',
                maxHeight: '24rem'
            };
        } else {
            style = {
                transition: 'all 200ms ease-out',
                maxHeight: '3.5rem'
            };
        }
        return (
            <div className={`${this.props.class} ${className}`} style={style}>
                <div className="collapse-block__header" onClick={this.toggleContent.bind(this)}>
                    <span className={arrowClassName} />
                    <div className="collapse-block__title">
                        {this.props.title}
                    </div>
                </div>
                <div className="collapse-block__body">
                    {this.props.content}
                </div>
            </div>
        );
    }
}
