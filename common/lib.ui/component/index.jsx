import React from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import Router from './router.js';
import Method from '../../../lib/util/method/client.js';

const contexts = {};

export default class BaseComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
        this.events = [];
    }

    // componentWillUnmount() {
    //     // set default title back
    //     if (this._titleUpdated) {
    //         this.setTitle();
    //         this._titleUpdated = false;
    //     }
    // }

    extendState(state) {
        if (_.isObject(state)) {
            Object.assign(this.state, state);
        }
    }

    getChildren() {
        return this.props.children || null;
    }

    hasChildren() {
        return !!this.getChildren();
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

    // ////////////
    // React Context support

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
            const mapper = _.isObjectNotEmpty(parameters) && _.isFunction(parameters.mapper) ? parameters.mapper : x => x;

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
     * Returns a HOC connected to the redux store of the application. The component will receive parts of the
     * store defined with .getStoreMapper() and dispatch() method through the properties.
     * The component will get re-rendered only when the forwarded parts of the redux store get changed.
     * @param Component
     * @param parameters
     * @returns {*}
     */
    static connectStore(Component = null, parameters = {}) {
        Component = Component || this;
        const mapper = _.isObjectNotEmpty(parameters) && _.isFunction(parameters.mapper) ? parameters.mapper : x => x;
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

    async execute(name, args) {
        return Method.execute(name, args);
    }
}
