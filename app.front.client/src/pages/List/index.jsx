import React from 'react';
import Layout from '../../components/LayoutInner';
import { Link } from 'react-router-dom';
import * as reducer from './reducer';
import page from '../../shared/components/Page';

const Page = ({ data }) => (
    <Layout>
        {
            _.isArrayNotEmpty(data)
            &&
            <div className="">
                {data.map(item => (
                    <div className="" key={item.name}>
                        {item.name}
                    </div>
                ))}
            </div>
        }
        <Link to="/">Home</Link><br />
        <Link to="/?__ssr=1">Home (static)</Link><br />
    </Layout>
);

export default page(Page, reducer, state => state.list);
