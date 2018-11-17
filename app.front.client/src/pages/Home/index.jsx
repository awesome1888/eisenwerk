import React from 'react';
import { connect } from 'react-redux';
// import PropTypes from 'prop-types';
import Layout from '../../components/LayoutInner';
import { Link } from 'react-router-dom';
// import TestComponent from '../../components/TestComponent';

class HomePage extends React.Component {
    render() {
        return (
            <Layout>
                Hello there 7
                <Link to="/list/seamonkeys/porn/live">List</Link><br />
                <Link to="/list/seamonkeys/porn/live?__ssr=1">List (static)</Link><br />
                {/*<TestComponent />*/}
            </Layout>
        );
    }
}

export default connect(state => state.home)(HomePage);
