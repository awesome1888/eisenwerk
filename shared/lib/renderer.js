import ReactDOMServer from 'react-dom/server';

export default class Renderer {

    constructor({settings, clientApplication, template}) {
        this._settings = settings;
        this._frontend = clientApplication;
        this._template = template;
    }

    async render(req, res) {
        if (_.isFunction(this._frontend)) {
            const Application = (await this._frontend()).default;
            const application = new Application({
                settings: this._settings.prepareForClient(),
            });

            await application.launch();

            const body = ReactDOMServer.renderToString(
              application.getUI()
            );

            res.status(200);
            res.set('Content-Type', 'text/html');
            res.send(this._template.get({
                body,
                settings: {},
            }));
        } else {
            throw new Error(500);
        }
    }
}
