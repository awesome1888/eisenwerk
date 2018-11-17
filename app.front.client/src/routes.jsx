import React from 'react';
import LayoutOuter from './components/LayoutOuter';
import PagePlugin from './shared/components/PagePlugin';
import pages from './pages';

import { Link } from 'react-router-dom';

export default [
    {
        exact: true,
        path: '/',
        page: pages[0],

        render: route => (
            <LayoutOuter>
                {/*<PagePlugin*/}
                    {/*page={pages[0]}*/}
                    {/*route={route}*/}
                {/*/>*/}
                HOME - 2
                <Link to="/list">List</Link>
            </LayoutOuter>
        ),
    },
    {
        path: '/list',
        page: pages[1],

        render: route => (
            <LayoutOuter>
                {/*<PagePlugin*/}
                    {/*page={pages[1]}*/}
                    {/*route={route}*/}
                {/*/>*/}
                LIST - 2
                <Link to="/">Home</Link>
            </LayoutOuter>
        ),
    },
];
