import React from 'react';
import { connect } from 'react-redux';
// import PropTypes from 'prop-types';
import Layout from '../../components/LayoutInner';
// import { Link } from 'react-router-dom';

class HomePage extends React.Component {
    render() {
        return (
            <Layout>
                Hello there
            </Layout>
        );
    }
}

export default connect(state => state.home)(HomePage);
