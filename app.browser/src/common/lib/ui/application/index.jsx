import React from 'react';
import BaseComponent from '../component/index.jsx';
import { GatewayProvider } from 'react-gateway';
import RouteComponent from './route.jsx';
import Router from './router.jsx';
import Modal from '../../../ui/component/modal/modal.jsx';
import Util from './../../util/index.js';
import PageScroll from './../../util/page-scroll/page-scroll.js';

// redux
import { Provider } from 'react-redux';

export const Route = RouteComponent;
export default class BaseApplication extends BaseComponent {

    _appContainer = null;

    constructor(props) {
        super(props);
        this.state = {
            application: props.application || null,
        };
        this.onGlobalClick = this.onGlobalClick.bind(this);
    }

    componentDidMount() {
        // load initial stuff
        this.getApplication().getAuthorization().getUser().then((user) => {
            this.setUser(user);
            this.setReady(true);
        }).catch(() => {
            this.setReady(true);
        });
        if (this._appContainer) {
            this._appContainer.addEventListener('click', this.onGlobalClick, true);
        }
    }

    componentWillUnMount() {
        if (this._appContainer) {
            this._appContainer.removeEventListener('click', this.onGlobalClick, true);
        }
    }

    onGlobalClick(e) {
        let node = Util.findClosestParent(e.target, 'a[data-save-scroll="true"]');
        if (node) {
            PageScroll.store();
            return;
        }

        node = Util.findClosestParent(e.target, 'a[data-reset-scroll="true"]');
        if (node) {
            PageScroll.clear();
        }
    }

    getActionScope() {
        return 'global';
    }

    getRoutes() {
    }

    getApplication() {
        return this.props.application;
    }

    getNetwork() {
        return this.getApplication().getNetwork();
    }

    getStore() {
        return this.props.dataStore || null;
    }

    dispatchGlobal(action, payload = {}) {
        this.getStore().dispatch({
            type: action,
            payload,
        });
    }

    setUser(user) {
        this.dispatch('user.set', user);
    }

    setReady(flag) {
        this.dispatch('ready.set', !!flag);
        if (_.isObjectNotEmpty(window.__overlay)) {
            window.__overlay.setReady();
            window.__overlay.hide();
        }
    }

    /**
     * The render method which already provides some design, contains a router and other application-wide stuff
     * @returns {*}
     */
    renderLayout() {
        return (
            <Router>
                {this.getRoutes()}
            </Router>
        );
    }

    /**
     * The main render method of the app. Typically it *should* contain only providers of different kind
     * (the components which do not affect rendering and don`t appear as tags).
     * @returns {*}
     */
    render() {
        const ContextProvider = this.getContextProvider();
        return (
            <Provider store={this.getStore()}>
                <ContextProvider value={this.state}>
                    <GatewayProvider>
                        <div
                            ref={(ref) => { this._appContainer = ref; }}
                        >
                            {this.renderLayout()}
                            <Modal />
                        </div>
                    </GatewayProvider>
                </ContextProvider>
            </Provider>
        );
    }
}
