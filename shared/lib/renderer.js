export default class Renderer {

    constructor(frontApplication) {
        this._frontend = frontApplication;
    }

    async render(req, res, template) {
        res.status(200);
        res.set('Content-Type', 'text/html');
        res.send('I was rendered');
    }
}
