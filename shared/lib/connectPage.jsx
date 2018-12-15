import React from 'react';
import { connect } from 'react-redux';

export default parameters => {
    parameters = parameters || {};
    let { reducer, mapStateToProps } = parameters;

    if (!mapStateToProps) {
        mapStateToProps = state => state[reducer.mountPoint];
    }

    return (Component, ErrorScreen = null) =>
        connect(mapStateToProps)(
            class extends React.Component {
                onLogOut = () => {
                    let type = this.props.application.getReducer()
                        .AUTHORIZED_UNSET;
                    if (reducer.AUTHORIZED_UNSET) {
                        // the page can override the default AUTHORIZED_UNSET in order to do something, like i.e. save form data
                        type = reducer.AUTHORIZED_UNSET;
                    }

                    this.props.dispatch({
                        type,
                    });
                };

                componentDidMount() {
                    if (reducer.ENTER) {
                        this.props.dispatch({
                            type: reducer.ENTER,
                            payload: this.props,
                        });
                    }
                    this.setMeta(this.props.meta);

                    const app = this.props.application;
                    if (app) {
                        app.getEmitter().on('logout', this.onLogOut);
                    }
                }

                componentDidUpdate() {
                    this.setMeta(this.props.meta);
                }

                componentWillUnmount() {
                    if (reducer.LEAVE) {
                        this.props.dispatch({ type: reducer.LEAVE });
                    }
                    this.setMeta();

                    const app = this.props.application;
                    if (app) {
                        app.getEmitter().off('logout', this.onLogOut);
                    }
                }

                setMeta(meta = {}) {
                    window.document.title = meta.title || '';
                }

                render() {
                    if (
                        this.props.ready &&
                        this.props.httpCode !== 200 &&
                        ErrorScreen
                    ) {
                        const { httpCode, error } = this.props;
                        return <ErrorScreen status={httpCode} error={error} />;
                    }
                    return <Component {...this.props} />;
                }
            },
        );
};
