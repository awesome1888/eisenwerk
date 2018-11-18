import React from 'react';
import DynamicImport from '../DynamicImport';

const PageLoader = ({page, route}) => {
    return (
        <React.Fragment>
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
        </React.Fragment>
    );
};

export default PageLoader;
