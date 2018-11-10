export default class Renderer {

    constructor(frontend) {
        this._frontend = frontend;
    }

    async render(req, res, template) {
        res.status(200);
        res.set('Content-Type', 'text/html');
        res.send('I was rendered!!!');
    }
}
