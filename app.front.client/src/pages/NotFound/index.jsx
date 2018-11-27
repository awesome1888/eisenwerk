import React from 'react';
import Layout from '../../components/LayoutInner';
import { Link } from 'react-router-dom';
import * as reducer from './reducer';
import connectPage from '../../shared/lib/connectPage';

const NotFoundPage = () => (
    <Layout>
        Sorry, nothing were found<Link to="/">Home</Link>
        <br />
        <Link to="/?__ssr=1">Home (static)</Link>
        <br />
    </Layout>
);

export default connectPage({ reducer })(NotFoundPage);
