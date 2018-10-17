/**
 * The class just encapsulates some operations over the connected router, to avoid putting it to the main scope.
 * todo: implement prefixes here
 */

import qs from 'query-string';

export default class Router {
    constructor(component) {
        this._c = component;
    }

    go(url) {
        this.getHistory().push(url);
    }

    getLocation() {
        if (!_.isObjectNotEmpty(this._c.props.location)) {
            this._c.makeError('router');
        }

        return this._c.props.location;
    }

    getPathName() {
        return this.getLocation().pathname || '';
    }

    getHistory() {
        if (!_.isObjectNotEmpty(this._c.props.history)) {
            this._c.makeError('router');
        }

        return this._c.props.history;
    }

    getRouteParameters() {
        if (_.isObjectNotEmpty(this._c.props.match)) {
            return this._c.props.match.params || {};
        }

        return {};
    }

    /**
     * Returns all query parameters, parsed
     * @returns {*}
     */
    getQueryParameters() {
        const query = this.getLocation().search;
        if (!_.isStringNotEmpty(query)) {
            return {};
        }

        return qs.parse(query);
    }

    // getQueryParameter(name) {
    //     if (!_.isStringNotEmpty(name)) {
    //         return null;
    //     }
    //
    //     const params = this.getQueryParameters();
    //     if (_.isObjectNotEmpty(params)) {
    //         return params[name] || null;
    //     }
    //
    //     return null;
    // }

    /**
     * Sets a bunch of parameters to the desirable values. All missing parameters stay the same.
     * The call of this function forces router to re-render.
     * @param parameters
     */
    setQueryParameters(parameters = {}) {
        const params = this.getQueryParameters();
        Object.assign(params, parameters);

        this.getHistory().replace(`${this.getPathName()}?${qs.stringify(params)}`);
    }

    /**
     * Sets one specific parameter to the desirable value. All missing parameters stay the same.
     * The call of this function forces router to re-render.
     * @param name
     * @param value
     */
    setQueryParameter(name, value) {
        const params = this.getQueryParameters();
        params[name] = value;
        this.getHistory().replace(`${this.getPathName()}?${qs.stringify(params)}`);
    }

    /**
     * Sets a bunch of parameters to the desirable values. All missing parameters will be wiped-out.
     * The call of this function forces router to re-render.
     * @param parameters
     */
    replaceQueryParameters(parameters = {}) {
        this.getHistory().replace(`/?${qs.stringify(parameters)}`);
    }
}
