import React from 'react';
import { Link } from 'react-router-dom';
import logoImage from './logo.svg';

export default class Logo extends React.Component {
    onClick() {
        if (_.isFunction(this.props.onClick)) {
            this.props.onClick();
        }
    }

    renderImage() {
        const props = this.props;
        const height = props.height || 32;

        return (<img src={logoImage} alt="Seven Lanes" height={height} width={height * 7.5} />);
    }

    render() {
        const props = this.props;

        let to = props.to;
        if (!_.isStringNotEmpty(to)) {
            to = '/';
        }

        if (!to.startsWith('/')) {
            return (
                <a
                    className="general__logo"
                    href={props.to}
                    {...props}
                    rel="noreferrer noopener"
                >
                    {this.renderImage()}
                </a>
            );
        } else {
            return (
                <Link
                    className="general__logo"
                    to={props.to}
                    {...props}
                >
                    {this.renderImage()}
                </Link>
            );
        }
    }
}
