import BaseApplication from './express.js';
import Template from '../../template';

export default class FrontServerApplication extends BaseApplication {

    useSSR(res) {
        if (!this.getSettings().useSSR()) {
            return false;
        }

        return res.query && (!!res.query.__ssr || !!res.query.__srr);
    }

    async getRenderer() {
        if (!this._renderer) {
            const Renderer = (await import('../../renderer')).default;
            this._renderer = new Renderer({
                template: this.getTemplate(),
                clientApplication: this.getParams().clientApplication,
            });
        }

        return this._renderer;
    }

    getTemplate() {
        if (!this._template) {
            this._template = new Template({
                settings: this.getSettings(),
            });
        }

        return this._template;
    }

    attachMiddleware() {
        super.attachMiddleware();
        // todo: instead of just putting * we need to check here if we are trying to get a route-like url
        // todo: i.e. /something/like/that/, but /blah.jpg will not be the case
        this.getNetwork().get('*', async (req, res) => {
            if (this.useSSR(req)) {
                // give back the page html
                const renderer = await this.getRenderer();
                await renderer.render(req, res);
            } else {
                // just serve as-is
                res.status(200);
                res.set('Content-Type', 'text/html');
                res.send(this.getTemplate().get());
            }
        });
    }

    attachErrorHandler() {
        const app = this.getNetwork();

        // don't remove "next", because...
        // https://expressjs.com/en/guide/using-middleware.html#middleware.error-handling
        app.use((error, req, res, next) => {
            const code = parseInt(error.message, 10);
            res.status(code);

            if (!this.getSettings().isProduction()) {
                res.set('Content-Type', 'text/html');
                res.send(`<div style="white-space: pre-wrap">${error.stack}</div>`);
            } else {
                res.send(code === 404 ? 'Not found' : 'Error');
            }
        });
    }
}
