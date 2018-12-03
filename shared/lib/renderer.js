import ReactDOMServer from 'react-dom/server';
import SSRRouter from './ssr-router';
import redirector from './redirector';

export default class Renderer {
    constructor({ settings, clientApplication, template }) {
        this._settings = settings;
        this._frontend = clientApplication;
        this._template = template;
        this._hooks = {};
    }

    on(where, what) {
        if (!_.isStringNotEmpty(where) || !_.isFunction(what)) {
            return;
        }
        this._hooks[where] = this._hooks[where] || [];
        this._hooks[where].push(what);
    }

    off(where, what) {
        if (_.isArrayNotEmpty(this._hooks[where])) {
            return;
        }

        this._hooks[where] = this._hooks[where].filter(x => x !== what);
    }

    async processBefore(req, res) {
        if (_.isArrayNotEmpty(this._hooks.before)) {
            for (let i = 0; i < this._hooks.before.length; i++) {
                const result = await this._hooks.before[i](req);
                if (_.isStringNotEmpty(result)) {
                    this.send(res, result, 200);
                    return false;
                }
            }
        }

        return true;
    }

    async processAfter(result, req, res) {
        if (_.isArrayNotEmpty(this._hooks.after)) {
            for (let i = 0; i < this._hooks.after.length; i++) {
                await this._hooks.after[i](result, req, res);
            }
        }
    }

    async render(req, res) {
        let application = null;

        if (!(await this.processBefore(req, res))) {
            return;
        }

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
                    if (
                        this.makeRedirect(store, application, res, match, route)
                    ) {
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

                // console.dir('state:');
                // console.dir(store.getReduxStore().getState());

                const result = new Buffer(
                    this._template.get({
                        body,
                        page,
                        settings: {},
                        state: store.getReduxStore().getState(),
                        dry: true,
                    }),
                );

                if (status === 200) {
                    await this.processAfter(result, req, res);
                }

                this.send(res, result, status);
            } else {
                throw new Error('Unable to load data');
            }
        } catch (e) {
            if (!__DEV__ && application) {
                // we can show something meaningful
                this.send(
                    res,
                    new Buffer(
                        this._template.get({
                            body: ReactDOMServer.renderToStaticMarkup(
                                application.renderError(e),
                            ),
                            page: {
                                title: 'Error',
                            },
                            settings: {},
                            state: {},
                            dry: true,
                        }),
                    ),
                    500,
                );
                await application.teardown();
            } else {
                throw e;
            }
        }
    }

    /**
     * Maybe make server-side redirect based on application state and resolved route rules
     * @param store
     * @param application
     * @param res
     * @param match
     * @param route
     * @returns {boolean}
     */
    makeRedirect(store, application, res, match, route) {
        const aData = store.getApplicationData();

        const routeProps = _.mergeShallow(match, route);
        routeProps.useAuth = application.useAuth();
        if (routeProps.useAuth) {
            Object.assign(routeProps, {
                user: aData.user,
            });
        }

        const redirect = redirector(routeProps);
        if (_.isStringNotEmpty(redirect)) {
            res.status(302);
            res.set('Location', redirect);
            res.send('');
            return true;
        }

        return false;
    }

    send(res, data, status = 200) {
        res.status(status);
        res.set('Content-Type', 'text/html');
        res.send(data);
    }
}
