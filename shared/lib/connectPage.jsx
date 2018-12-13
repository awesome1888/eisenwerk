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
                componentDidMount() {
                    if (reducer.ENTER) {
                        this.props.dispatch({
                            type: reducer.ENTER,
                            payload: this.props,
                        });
                    }
                    this.setMeta(this.props.meta);
                }

                componentDidUpdate() {
                    this.setMeta(this.props.meta);
                }

                componentWillUnmount() {
                    if (reducer.LEAVE) {
                        this.props.dispatch({ type: reducer.LEAVE });
                    }
                    this.setMeta();
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
