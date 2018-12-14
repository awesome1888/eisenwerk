import React from 'react';
import DynamicImport from '../DynamicImport';

const PageLoader = ({ page, route, routeProperties }) => {
    const pageProperties = {
        route,
        application: routeProperties.application,
    };

    return (
        <React.Fragment>
            {page.lazy && (
                <DynamicImport load={page.ui}>
                    {Component =>
                        Component && <Component {...pageProperties} />
                    }
                </DynamicImport>
            )}
            {!page.lazy && <page.ui {...pageProperties} />}
        </React.Fragment>
    );
};

export default PageLoader;
