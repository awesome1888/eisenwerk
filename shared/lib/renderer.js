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
                currentURL: req.path,
            });

            await application.launch();

            const store = application.getStore();
            // load main reducer data
            await store.loadApplicationData();
            if (store.checkApplicationData()) {

                // load page data

                // need to calculate what page to show...
                const route = SSRRouter.match(req.path, application.getRoutes());
                if (!route) {
                    // todo: ???
                }

                console.dir('route');
                console.dir(route);

                await store.loadPageData(route.page, {/* todo: route data */});

                // console.dir('result state:');
                // console.dir(store.getReduxStore().getState());

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
