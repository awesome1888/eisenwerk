import React from 'react';
import PropTypes from 'prop-types';
import { Route as RouteComponent, Redirect} from 'react-router-dom';
import BaseComponent from '../component/index.jsx';
import Access from '../../../lib/util/access/client.js';

export default class Route extends BaseComponent {

    static propTypes = {
        redirectAuthorized: PropTypes.string,
        redirectNotAuthorized: PropTypes.string,
        access: PropTypes.object,
    };

    static defaultProps = {
        redirectAuthorized: '',
        redirectNotAuthorized: '',
        access: {},
    };

    render() {
        const user = this.props.user;
        const hasUser = _.isObjectNotEmpty(user);

        const ra = this.props.redirectAuthorized;
        const rua = this.props.redirectNotAuthorized;
        const access = this.props.access;

        if (hasUser && _.isStringNotEmpty(ra)) {
            console.dir(`${this.props.path}: authorized, going to ${ra}`);
            return (<Redirect to={ra} />);
        }

        if (!hasUser && _.isStringNotEmpty(rua)) {
            console.dir(`${this.props.path}: not authorized, going to ${rua}`);
            return (<Redirect to={rua} />);
        }

        let whereTo = false;
        if (_.isObjectNotEmpty(this.props.redirect)) {
            _.forEach(this.props.redirect, (condition, url) => {
                if (whereTo) {
                    return;
                }

                if ((_.isFunction(condition) && !!condition()) || (!_.isFunction(condition) && !!condition)) {
                    whereTo = url;
                }
            });
        } else if (_.isFunction(this.props.redirect)) {
            whereTo = this.props.redirect();
        }

        if (whereTo) {
            console.dir(`${this.props.path}: going to ${whereTo}`);
            return (<Redirect to={whereTo} />);
        }

        if (_.isObjectNotEmpty(access)) {
            const test = Access.testRoute(user, access);
            /**
             * todo: you wont be able to make custom checks async while make checks in render(). Think of better way!
             */
            if (test instanceof Promise) {
                throw new Error('Async access check is not currently supported');
            }
            if (!test) {
                return (<Redirect to="/403" />);
            }
        }

        return (
            <RouteComponent {...this.props} />
        );
    }
}
