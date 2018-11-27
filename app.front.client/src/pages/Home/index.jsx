import React from 'react';
import Layout from '../../components/LayoutInner';
import { Link } from 'react-router-dom';
import * as reducer from './reducer';
import connectPage from '../../shared/lib/connectPage';

const HomePage = () => (
    <Layout>
        Hello there 7<Link to="/list/seamonkeys/porn/live">List</Link>
        <br />
        <Link to="/list/seamonkeys/porn/live?__ssr=1">List (static)</Link>
        <br />
    </Layout>
);

export default connectPage({ reducer })(HomePage);
