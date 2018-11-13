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
            });

            await application.launch();

            // load data
            const pages = Application.getPages();
            const tmpPage = pages[1]; // tmp, this should come from router

            const store = application.getStore().getReduxStore();

            console.dir('Initial:');
            console.dir(store.getState());

            const unsubscribe = store.subscribe(() => {
                console.dir(store.getState());
            });
            console.dir('dispatch');
            console.dir({type: tmpPage.initial, payload: {/*todo: route data*/}});
            store.dispatch({type: tmpPage.initial, payload: {/*todo: route data*/}});

            await new Promise((resolve) => {setTimeout(resolve, 2000)});

            unsubscribe();

            const body = ReactDOMServer.renderToStaticMarkup(application.getUI());
            await application.teardown();

            res.status(200);
            res.set('Content-Type', 'text/html');
            res.send(this._template.get({
                body,
                settings: {},
                dry: true,
            }));
        } else {
            throw new Error(500);
        }
    }
}
