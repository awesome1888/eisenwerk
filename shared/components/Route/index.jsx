import React from 'react';
import { Route as RouteComponent, Redirect} from 'react-router-dom';
import Access from '../../lib/access/client.js';

const Route = (props) => {
    // find where to redirect
    const ra = props.redirectAuthorized;
    const rna = props.redirectNotAuthorized;

    let whereTo = null;
    if (!props.authorized && _.isStringNotEmpty(rna)) {
        whereTo = rna;
    }

    if (props.authorized && _.isStringNotEmpty(ra)) {
        whereTo = ra;
    }

    if (!whereTo) {
        if (_.isObjectNotEmpty(props.redirect)) {
            Object.keys(props.redirect).forEach((url) => {
                const condition = props.redirect[url];

                if (whereTo) {
                    return;
                }

                if ((_.isFunction(condition) && !!condition()) || (!_.isFunction(condition) && !!condition)) {
                    whereTo = url;
                }
            });
        } else if (_.isFunction(props.redirect)) {
            whereTo = props.redirect();
        }
    }

    if (whereTo) {
        console.dir('Going to '+whereTo);
        return (<Redirect to={whereTo} />);
    }

    // check the route access
    const access = props.access;
    const user = props.user;

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
        <RouteComponent {...props} />
    );
};

export default Route;
