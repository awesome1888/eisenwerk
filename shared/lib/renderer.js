import ReactDOMServer from 'react-dom/server';
import SSRRouter from './ssr-router';
import redirector from './redirector';

export default class Renderer {
    constructor({ settings, clientApplication, template, hooks }) {
        this._settings = settings;
        this._frontend = clientApplication;
        this._template = template;
        this._hooks = hooks;
    }

    async render(req, res) {
        let application = null;
        try {
            const Application = (await this._frontend()).default;
            application = new Application({
                settings: this._settings.prepareForClient(),
                currentURL: req.originalUrl,
            });
            await application.launch();

            const store = application.getStore();
            // load main reducer data
            await store.loadApplicationData();
            if (store.getApplicationData().ready) {
                // load page data
                const { route, match } = SSRRouter.match(
                    req.path,
                    application.getRoutes(),
                );
                if (route && match) {
                    const aData = store.getApplicationData();

                    const routeProps = _.mergeShallow(match, route);
                    routeProps.useAuth = application.useAuth();
                    if (routeProps.useAuth) {
                        Object.assign(routeProps, {
                            user: aData.user,
                        });
                    }

                    // console.dir('ROUTE PROPS');
                    // console.dir(routeProps);

                    const redirect = redirector(routeProps);
                    if (_.isStringNotEmpty(redirect)) {
                        res.status(302);
                        res.set('Location', redirect);
                        res.send('');
                        return;
                    }

                    const routeState = store.getReduxStore().getState().router;
                    routeState.match = match;

                    await store.loadPageData(route.page, { route: routeState });

                    // pre-load ui
                    if (route.page.lazy) {
                        route.page.ui = (await route.page.ui()).default;
                        route.page.lazy = false;
                    }
                }

                const body = ReactDOMServer.renderToStaticMarkup(
                    application.render(),
                );
                await application.teardown();

                let page = {};
                let status = 200;

                if (route && match) {
                    status = store.getPageHttpCode(route.page);
                    page = store.getPageMeta(route.page);
                }

                console.dir('state:');
                console.dir(store.getReduxStore().getState());

                this.send(
                    res,
                    {
                        body,
                        page,
                        settings: {},
                        state: store.getReduxStore().getState(),
                        dry: true,
                    },
                    status,
                );
            } else {
                throw new Error('Unable to load data');
            }
        } catch (e) {
            if (!__DEV__ && application) {
                // we can show something meaningful
                this.send(
                    res,
                    {
                        body: ReactDOMServer.renderToStaticMarkup(
                            application.renderError(e),
                        ),
                        page: {
                            title: 'Error',
                        },
                        settings: {},
                        state: {},
                        dry: true,
                    },
                    500,
                );
            } else {
                throw e;
            }
        }
    }

    send(res, data, status = 200) {
        res.status(status);
        res.set('Content-Type', 'text/html');
        res.send(new Buffer(this._template.get(data)));
    }
}
