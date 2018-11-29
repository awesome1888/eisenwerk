import React from 'react';
import { connect } from 'react-redux';

export default parameters => {
    parameters = parameters || {};
    let { reducer, mapStateToProps } = parameters;

    if (!mapStateToProps) {
        mapStateToProps = state => state[reducer.mountPoint];
    }

    return Component =>
        connect(mapStateToProps)(
            class extends React.Component {
                componentDidMount() {
                    if (reducer.ENTER) {
                        this.props.dispatch(
                            { type: reducer.ENTER },
                            { route: this.props.route },
                        );
                    }
                }

                componentDidUpdate() {
                    this.setMeta(this.props.meta);
                }

                componentWillUnmount() {
                    if (reducer.LEAVE) {
                        this.props.dispatch({ type: reducer.LEAVE });
                    }
                }

                setMeta(meta = {}) {
                    window.document.title = meta.title || '';
                }

                render() {
                    return <Component {...this.props} />;
                }
            },
        );
};
