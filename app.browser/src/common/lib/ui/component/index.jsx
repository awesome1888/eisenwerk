import React from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import Util from '../../util/index.js';
import Router from './router.js';
import Method from '../../../lib/util/method/client.js';

const contexts = {};

export default class BaseComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {},
            dataReady: false,
            error: null,
        };
        this.events = [];
    }

    componentDidMount() {
        if (this.needLoadData()) {
            this.startDataReload(this.props);
        }
    }

    componentWillUnmount() {
        // set default title back
        if (this._titleUpdated) {
            this.setTitle();
            this._titleUpdated = false;
        }
    }

    extendState(state) {
        if (_.isObject(state)) {
            Object.assign(this.state, state);
        }
    }

    getRouterParam(paramName) {
        return _.getValue(this.props, `match.params.${paramName}`);
    }

    getDataQuery() {
        return null;
    }

    getIdPropertyCode() {
        return false;
    }

    needLoadData() {
        return true;
    }

    async getDataQueryParameters(id) {
        return {id};
    }

    getDataOne() {
        return true;
    }

    setDataLoaded(res) {
        this.setData(res);
        if (_.isFunction(this.props.onDataReloaded)) {
            this.props.onDataReloaded(res);
        }
    }

    getDataReloadParam(props, attribute) {
        return props[attribute];
    }

    async startDataReload(props) {
        if (!props) {
            props = this.props;
        }
        const q = this.getDataQuery();

        if (q) {
            const id = this.getDataReloadParam(props, this.getIdPropertyCode());

            if (id && Util.isId(id)) {
                const params = await this.getDataQueryParameters(id);
                const fName = this.getDataOne() ? 'fetchOne' : 'fetch';
                q.clone(params)[fName]()
                    .then((res) => {
                        this.setDataLoaded(res);
                    })
                    .catch((err) => {
                        console.error(err);
                    });
            }
        }

        return {};
    }

    setData(data) {
        this.setState({
            data,
            dataReady: true,
        });
    }

    getData() {
        return this.state.data;
    }

    getChildren() {
        return this.props.children || null;
    }

    hasChildren() {
        return !!this.getChildren();
    }

    fire(event, args = []) {
        $(document).trigger(event, args);
    }

    /**
     * A fabric which produces HOC connected to different parts of the app: store, context and router
     * @param to
     * @returns {BaseComponent}
     */
    static connect(to) {
        let _this = this;

        if (_.isObjectNotEmpty(to)) {
            if ('store' in to) {
                let params = {};
                if (_.isFunction(to.store)) {
                    params.mapper = to.store;
                } else if (_.isObjectNotEmpty(to.store)) {
                    params = to.store;
                }
                _this = this.connectStore(_this, params);
            }

            if ('context' in to) {
                let params = {};
                if (_.isFunction(to.context)) {
                    params.mapper = to.context;
                } else if (_.isObjectNotEmpty(to.context)) {
                    params = to.context;
                }
                _this = this.connectContext(_this, params);
            }

            // router always goes last
            if ('router' in to) {
                _this = withRouter(_this);
            }
        }

        return _this;
    }

    // ////////////
    // Standard operations to interact with data from the connected things

    /**
     * Get application from the connected context
     */
    getApplication() {
        if (!('application' in this.props)) {
            this.makeError('context');
        }

        return this.props.application;
    }

    getRouter() {
        if (!this._router) {
            this._router = new Router(this);
        }

        return this._router;
    }

    /**
     * Tells router to redirect to the specified url
     * @param url
     * @deprecated
     */
    redirectTo(url) {
        this.getRouter().go(url);
    }

    // ////////////
    // React Context support

    static getContextMapper() {
        return context => context;
    }

    /**
     * Returns a HOC connected to the context with a given code (in parameters). The content of the context
     * will be available through this.props.context.
     * @param Component
     * @param parameters
     * @returns {function(*): *}
     */
    static connectContext(Component = null, parameters = {}) {
        Component = Component || this;
        const code = _.isObjectNotEmpty(parameters) && _.isStringNotEmpty(parameters.code) ? parameters.code : 'main';

        return function ConnectedComponent(props) {

            const context = contexts[code];
            if (!context) {
                throw new Error(`No context defined with code '${code}'`);
            }

            const Consumer = context.Consumer;
            const mapper = _.isObjectNotEmpty(parameters) && _.isFunction(parameters.mapper) ? parameters.mapper : Component.getContextMapper();

            return (
                <Consumer>
                    {ctx => <Component {...props} {...mapper(ctx)} />}
                </Consumer>
            );
        };
    }

    /**
     * Creates a react context. Use a different code to produce a different one. Being once created, it is stored
     * component-wide and becomes accessible in each child component.
     * Context will use the state of the component it was originally created in.
     * @param code
     * @returns {*}
     */
    makeContext(code = 'main') {
        // dont use "this" here, we implicitly specify the exact constructor to attach the data to:
        // it should be always the same for every component
        if (!contexts[code]) {
            contexts[code] = React.createContext({
                ...this.state,
                update: (state) => {
                    if (_.isObjectNotEmpty(state)) {
                        this.setState(state);
                    }
                },
            });
        }

        return contexts[code];
    }

    /**
     * Get the provider of the store with the specified code.
     * @param code
     * @returns {*}
     */
    getContextProvider(code = 'main') {
        return this.makeContext(code).Provider;
    }

    /**
     * Get the consumer of the store with the specified code.
     * @param code
     * @returns {*}
     */
    getContextConsumer(code = 'main') {
        return this.makeContext(code).Consumer;
    }

    // ////////////
    // Redux Store support

    /**
     * This function declare which parts of the redux store state you would like to track
     * in this particular component.
     *
     * Note: when you declare this function like the following:
     *      return (state) => { return {state: {user: state.global.user}}; };
     * the code will cause re-render every time the store gets changed, because when you write
     *      return {...}
     * it means, that on each invocation a new instance of an object is returned, therefore the strict equality
     * check fails.
     *
     * The question is not that simple, when it comes to the performance. Read the official doc:
     * https://github.com/reduxjs/react-redux/blob/master/docs/api.md
     *
     * The default function maps everything to everything, but beware:
     * in case you are going so, you will loose all performance optimizations.
     * @returns {function(*): *}
     */
    static getStoreMapper() {
        return state => state;
    }

    /**
     * Returns a HOC connected to the redux store of the application. The component will receive parts of the
     * store defined with .getStoreMapper() and dispatch() method through the properties.
     * The component will get re-rendered only when the forwarded parts of the redux store get changed.
     * @param Component
     * @param parameters
     * @returns {*}
     */
    static connectStore(Component = null, parameters = {}) {
        Component = Component || this;
        const mapper = _.isObjectNotEmpty(parameters) && _.isFunction(parameters.mapper) ? parameters.mapper : Component.getStoreMapper();
        return connect(mapper)(Component);
    }

    /**
     * Returns action scope (prefix). This prefix will be put in use when making .dispatch(), but not .dispatchGlobal()
     * @returns {string}
     */
    getActionScope() {
        return '';
    }

    /**
     * Dispatches an action to the redux store, within the given optional action scope (prefix).
     * @param action
     * @param payload
     */
    dispatch(action, payload = {}) {
        const scope = this.getActionScope();
        if (_.isStringNotEmpty(scope)) {
            action = `${scope}.${action}`;
        }

        this.dispatchGlobal(action, payload);
    }

    /**
     * Dispatches an action to redux store, no action scope attached.
     * @param action
     * @param payload
     */
    dispatchGlobal(action, payload = {}) {
        if (!_.isFunction(this.props.dispatch)) {
            this.makeError('store');
        }
        this.props.dispatch({
            type: action,
            payload,
        });
    }

    makeError(feature) {
        throw new Error(`No ${feature} connected. Use ${this.constructor.name}.connect({${feature}: true}) to provide some.`);
    }

    isReady() {
        return this.state.dataReady;
    }

    setTitle(title = '') {
        title = title.replace(/#DASH#/g, '–');
        this.fire('set-title', title);

        let newTitle = 'Seven Lanes';
        if (_.isStringNotEmpty(title)) {
            newTitle = `${title} – ${newTitle}`;
        }
        document.title = newTitle;
        this._titleUpdated = true;
    }

    getCurrentPath() {

    }

    /**
     * Returns back url, if it was passed in the url query string
     * @returns {*}
     */
    getBackUrlUrlParam() {
        const url = Util.parseUrl();

        if (!_.isEmpty(url)) {
            return url.backUrl || url.backurl || '';
        }

        return '';
    }

    /**
     * Returns back url, if it was passed in the url query string, and makes it safe to go to
     * @param fallBack
     * @returns {*}
     */
    getUrlBackUrl(fallBack = '') {
        const backUrl = this.getBackUrlUrlParam();

        if (backUrl) {
            // open redirect attack protection
            return backUrl.replace(new RegExp(':+/+', 'g'), '/');
        }

        return fallBack;
    }

    async execute(name, args) {
        return Method.execute(name, args);
    }
}
