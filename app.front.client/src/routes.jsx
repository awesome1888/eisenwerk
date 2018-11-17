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
            <LayoutOuter>
                <PagePlugin
                    page={pages[0]}
                    route={route}
                />
            </LayoutOuter>
        ),
    },
    {
        path: '/list/:category/:topic/:way',
        page: pages[1],

        render: route => (
            <LayoutOuter>
                <PagePlugin
                    page={pages[1]}
                    route={route}
                />
            </LayoutOuter>
        ),
    },
];
