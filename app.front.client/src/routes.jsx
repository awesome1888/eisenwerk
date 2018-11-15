import React from 'react';
import LayoutOuter from './components/LayoutOuter';
import PagePlugin from './shared/components/PagePlugin';
import pages from './pages';

export default [
    {
        exact: true,
        path: '/',
        page: pages[0],

        render: route => (
            <PagePlugin
                layout={LayoutOuter}
                page={pages[0]}
                route={route}
            />
        ),
    },
];
