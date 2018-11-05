import React from 'react';
import { connect } from 'react-redux';
// import PropTypes from 'prop-types';
import Layout from '../../components/LayoutInner';
import { Link } from 'react-router-dom';

class ListPage extends React.Component {

    componentDidMount() {
        console.dir('Page rendered');
    }

    render() {
        return (
            <Layout>
                Ein
                Zwei
                Drei
                <Link to="/">Home</Link>
            </Layout>
        );
    }
}

export default connect(state => state.home)(ListPage);
