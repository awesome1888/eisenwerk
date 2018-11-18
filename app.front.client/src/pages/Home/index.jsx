import React from 'react';
import Layout from '../../components/LayoutInner';
import { Link } from 'react-router-dom';
import * as reducer from './reducer';
import page from '../../shared/components/Page';

class HomePage extends React.Component {
    render() {
        return (
            <Layout>
                Hello there 7
                <Link to="/list/seamonkeys/porn/live">List</Link><br />
                <Link to="/list/seamonkeys/porn/live?__ssr=1">List (static)</Link><br />
            </Layout>
        );
    }
}

export default page(HomePage, reducer, state => state.home);
