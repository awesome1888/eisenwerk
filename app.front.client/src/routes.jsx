// import React from 'react';
import LayoutOuter from './components/LayoutOuter';
import pages from './pages';

export default [
    {
        exact: true,
        path: '/',
        // redirectNotAuthorized: '/login',

        page: pages[0],
        // this...
        layoutUI: LayoutOuter,
        // ...or render()
    },
    {
        path: '/list',

        page: pages[1],
        // this...
        layoutUI: LayoutOuter,
        // ...or render()
    },
];

// render: (route) => {
//     return (
//         <LayoutOuter>
//             <HomePage match={route.match} />
//         </LayoutOuter>
//     );
// }
// render: (route) => {
//     return (
//         <LayoutOuter>
//             <DynamicImport load={() => import('./pages/List')}>
//                 {Component => Component && <Component match={route.match} />}
//             </DynamicImport>
//         </LayoutOuter>
//     );
// }
