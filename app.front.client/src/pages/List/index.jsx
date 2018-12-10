import React from 'react';
import Layout from '../../components/LayoutInner';
import { Link } from 'react-router-dom';
import * as reducer from './reducer';
import connectPage from '../../shared/lib/connectPage';
import SorryScreen from '../../components/SorryScreen';

const ListPage = ({ data }) => (
    <Layout>
        {_.isArrayNotEmpty(data) && (
            <div className="">
                {data.map(item => (
                    <div className="" key={item.getId()}>
                        {item.getData().title}
                    </div>
                ))}
            </div>
        )}
        <Link to="/">Home</Link>
        <br />
        <Link to="/?__ssr=1">Home (static)</Link>
        <br />
    </Layout>
);

export default connectPage({ reducer })(ListPage, SorryScreen);
