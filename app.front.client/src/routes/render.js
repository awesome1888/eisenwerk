import React from 'react';
import { Switch } from 'react-router';
import Route from '../shared/components/Route';

import LayoutOuter from '../components/LayoutOuter';
import PageLoader from '../shared/components/PageLoader';

const renderRoutes = ({ routes, routeProperties }) => {
    return (
        <Switch>
            <Route
                {...routes.home}
                {...routeProperties}
                render={route => (
                    <LayoutOuter>
                        <PageLoader
                            route={route}
                            page={routes.home.page}
                            routeProperties={routeProperties}
                        />
                    </LayoutOuter>
                )}
            />
            <Route
                {...routes.login}
                {...routeProperties}
                render={route => (
                    <LayoutOuter>
                        <PageLoader
                            route={route}
                            page={routes.login.page}
                            routeProperties={routeProperties}
                        />
                    </LayoutOuter>
                )}
            />
            <Route
                {...routes.list}
                {...routeProperties}
                render={route => (
                    <LayoutOuter>
                        <PageLoader
                            route={route}
                            page={routes.list.page}
                            routeProperties={routeProperties}
                        />
                    </LayoutOuter>
                )}
            />
            <Route
                {...routes.restricted}
                {...routeProperties}
                render={route => (
                    <LayoutOuter>
                        <PageLoader
                            route={route}
                            page={routes.restricted.page}
                            routeProperties={routeProperties}
                        />
                    </LayoutOuter>
                )}
            />
            <Route
                {...routes.forbidden}
                {...routeProperties}
                render={route => (
                    <LayoutOuter>
                        <PageLoader
                            route={route}
                            page={routes.forbidden.page}
                            routeProperties={routeProperties}
                        />
                    </LayoutOuter>
                )}
            />
            <Route
                {...routes.logout}
                {...routeProperties}
                render={route => (
                    <LayoutOuter>
                        <PageLoader
                            route={route}
                            page={routes.logout.page}
                            routeProperties={routeProperties}
                        />
                    </LayoutOuter>
                )}
            />
            <Route
                {...routes.notFound}
                {...routeProperties}
                render={route => (
                    <LayoutOuter>
                        <PageLoader
                            route={route}
                            page={routes.notFound.page}
                            routeProperties={routeProperties}
                        />
                    </LayoutOuter>
                )}
            />
        </Switch>
    );
};

export default renderRoutes;
