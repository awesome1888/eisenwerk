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

    // replaceQueryParameters(parameters = {}) {
    //     this.getHistory().replace(`/?${qs.stringify(parameters)}`);
    // }

    setQueryParameters(parameters = {}) {
        const params = this.getQueryParameters();
        Object.assign(params, parameters);

        this.getHistory().replace(`${this.getPathName()}?${qs.stringify(params)}`);
    }

    setQueryParameter(name, value) {
        const params = this.getQueryParameters();
        params[name] = value;
        this.getHistory().replace(`${this.getPathName()}?${qs.stringify(params)}`);
    }
}
