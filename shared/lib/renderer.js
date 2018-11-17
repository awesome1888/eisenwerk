import React from 'react';
import ReactDOMServer from 'react-dom/server';
import SSRRouter from './ssr-router';

export default class Renderer {

    constructor({settings, clientApplication, template, hooks}) {
        this._settings = settings;
        this._frontend = clientApplication;
        this._template = template;
        this._hooks = hooks;
    }

    async render(req, res) {
        if (_.isFunction(this._frontend)) {
            const Application = (await this._frontend()).default;
            const application = new Application({
                settings: this._settings.prepareForClient(),
                currentURL: req.originalUrl,
            });

            await application.launch();

            const store = application.getStore();
            // load main reducer data
            await store.loadApplicationData();
            if (store.checkApplicationData()) {

                // load page data

                // need to calculate what page to show...
                const { route, match } = SSRRouter.match(req.path, application.getRoutes());
                if (!route) {
                    // todo: ???
                }

                const routeState = store.getReduxStore().getState().router;
                routeState.match = match;

                await store.loadPageData(route.page, { route: routeState });

                // pre-load ui
                if (route.page.lazy) {
                    route.page.ui = (await route.page.ui()).default;
                    route.page.lazy = false;
                }

                const body = ReactDOMServer.renderToStaticMarkup(application.render());
                await application.teardown();

                res.status(200);
                res.set('Content-Type', 'text/html');
                res.send(new Buffer(this._template.get({
                    body,
                    page: {}, //store.getPageData(tmpPage),
                    settings: {},
                    state: store.getReduxStore().getState(),
                    dry: true,
                })));
            } else {
                throw new Error('500');
            }
        } else {
            throw new Error('500');
        }
    }
}
