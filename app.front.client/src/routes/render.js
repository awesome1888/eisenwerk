import React from 'react';
import { Switch } from 'react-router';
import Route from '../shared/components/Route';

import LayoutOuter from '../components/LayoutOuter';
import PageLoader from '../shared/components/PageLoader';

const renderRoutes = ({ routes, appProps }) => {
    return (
        <Switch>
            <Route
                {..._.mergeShallow(routes.home, appProps)}
                render={route => (
                    <LayoutOuter>
                        <PageLoader page={routes.home.page} route={route} />
                    </LayoutOuter>
                )}
            />
            <Route
                {..._.mergeShallow(routes.login, appProps)}
                render={route => (
                    <LayoutOuter>
                        <PageLoader page={routes.login.page} route={route} />
                    </LayoutOuter>
                )}
            />
            <Route
                {..._.mergeShallow(routes.list, appProps)}
                render={route => (
                    <LayoutOuter>
                        <PageLoader page={routes.list.page} route={route} />
                    </LayoutOuter>
                )}
            />
            <Route
                {..._.mergeShallow(routes.restricted, appProps)}
                render={route => (
                    <LayoutOuter>
                        <PageLoader
                            page={routes.restricted.page}
                            route={route}
                        />
                    </LayoutOuter>
                )}
            />
            <Route
                {..._.mergeShallow(routes.forbidden, appProps)}
                render={route => (
                    <LayoutOuter>
                        <PageLoader
                            page={routes.forbidden.page}
                            route={route}
                        />
                    </LayoutOuter>
                )}
            />
            <Route
                {..._.mergeShallow(routes.logout, appProps)}
                render={route => (
                    <LayoutOuter>
                        <PageLoader page={routes.logout.page} route={route} />
                    </LayoutOuter>
                )}
            />
            <Route
                {..._.mergeShallow(routes.notFound, appProps)}
                render={route => (
                    <LayoutOuter>
                        <PageLoader page={routes.notFound.page} route={route} />
                    </LayoutOuter>
                )}
            />
        </Switch>
    );
};

export default renderRoutes;
