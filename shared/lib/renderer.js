import React from 'react';
import ReactDOMServer from 'react-dom/server';

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

            // load data
            const pages = Application.getPages();

            // routing
            // 1) задание роутера
            // 2) 404 ошибка в режиме ssr и без
            // 3) 403 ошибка в режиме ssr
            // 4) <Link /> должны работать

            const tmpPage = pages[1]; // tmp, this should come from router

            const store = application.getStore();

            await store.loadApplicationData();
            if (store.checkApplicationData()) {
                await store.loadPageData(tmpPage, {/* todo: route data */});
            }

            console.dir('result state:');
            console.dir(store.getReduxStore().getState());

            const body = ReactDOMServer.renderToStaticMarkup(application.render({
                // children: props => (
                //     <React.Fragment>
                //         {
                //             props.ready
                //             &&
                //             <div>I am ready to be free!!!</div>
                //         }
                //         <tmpPage.ui />
                //     </React.Fragment>
                // ),
            }));
            await application.teardown();

            res.status(200);
            res.set('Content-Type', 'text/html');
            res.send(new Buffer(this._template.get({
                body,
                page: store.getPageData(tmpPage),
                settings: {},
                state: store.getReduxStore().getState(),
                dry: true,
            })));
        } else {
            throw new Error(500);
        }
    }
}
