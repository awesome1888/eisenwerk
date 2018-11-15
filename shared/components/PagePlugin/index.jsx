import React from 'react';

const PagePlugin = ({page, route, layout}) => {
    const Layout = layout ? layout : React.Fragment;
    return (
        <Layout>
            {
                page.lazy
                &&
                <DynamicImport load={page.ui}>
                    {Component => Component && <Component route={route} />}
                </DynamicImport>
            }
            {
                !page.lazy
                &&
                <page.ui route={route} />
            }
        </Layout>
    );
};

export default PagePlugin;
