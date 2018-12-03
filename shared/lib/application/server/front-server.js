import BaseApplication from './express';
import Template from '../../template';
import SSRRouter from '../../ssr-router';
import { makeStatus } from '../../util';
import Cache from '../../cache';

export default class FrontServerApplication extends BaseApplication {
    useSSR(res) {
        if (!this.getSettings().useSSR()) {
            return false;
        }

        if (!_.isFunction(this.getParams().clientApplication)) {
            return false;
        }

        // todo: look at the user agent here
        return res.query && (!!res.query.__ssr || !!res.query.__srr);
    }

    readCache = async () => {
        console.dir('reading cache!');
        const res = await this.getCache().get();
    };

    storeCache = async () => {
        console.dir('store cache');
        const res = await this.getCache().set();
    };

    getCache() {
        if (!this._rendererCache) {
            const cache = new Cache();
            cache.init();

            this._rendererCache = cache;
        }

        return this._rendererCache;
    }

    async getRenderer() {
        if (!this._renderer) {
            const Renderer = (await import('../../renderer')).default;
            this._renderer = new Renderer({
                template: this.getTemplate(),
                clientApplication: this.getParams().clientApplication,
                settings: this.getSettings(),
            });
            this._renderer.on('before', this.readCache);
            this._renderer.on('after', this.storeCache);
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
        this.getNetwork().get('*', async (req, res, next) => {
            if (this.useSSR(req)) {
                try {
                    const renderer = await this.getRenderer();
                    await renderer.render(req, res);
                } catch (e) {
                    next(e);
                }
            } else {
                // just serve as-is
                res.status(await this.getStatusCode(req));
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
            if (res.headersSent) {
                return next(error);
            }

            const status = makeStatus(error.message);
            res.status(status);

            if (__DEV__) {
                res.set('Content-Type', 'text/html');
                res.send(
                    `<div style="white-space: pre-wrap">${error.stack}</div>`,
                );
            } else {
                res.send(status === 404 ? 'Not found' : 'Error');
            }

            return true;
        });
    }

    async getStatusCode(req) {
        let routes = null;
        if (_.isFunction(this.getParams().routes)) {
            routes = (await this.getParams().routes()).default;

            if (_.isObjectNotEmpty(routes)) {
                const { route } = SSRRouter.match(req.path, routes);
                return route ? 200 : 404;
            }
        }

        return 200;
    }
}
