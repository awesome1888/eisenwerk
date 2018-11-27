import React from "react";
import { connect } from "react-redux";

export default (Page, reducer, stateMapper = null) => {
  if (!stateMapper) {
    stateMapper = state => state;
  }

  return connect(stateMapper)(
    class extends React.Component {
      componentDidMount() {
        if (reducer.ENTER) {
          this.props.dispatch(
            { type: reducer.ENTER },
            { route: this.props.route }
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
        window.document.title = meta.title || "";
      }

      render() {
        return <Page {...this.props} />;
      }
    }
  );
};
