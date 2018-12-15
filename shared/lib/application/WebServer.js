import spiderDetector from 'spider-detector';

import ServerApplication from './Server';
import Express from '../express';
import Template from '../template';
import SSRRouter from '../ssr-router';
import { makeStatus } from '../util';
import Cache from '../cache';

export default class WebServerApplication extends ServerApplication {
    async launch() {
        process.on('unhandledRejection', (reason, p) => {
            console.log('Unhandled Rejection at: ', p, ' reason: ', reason);
        });
        process.on('uncaughtException', err => {
            console.log('Uncaught Exception thrown ', err);
            this.tearDown();
        });

        this.getSettings().checkMandatory();
        this.getNetwork().launch();
    }

    getNetwork() {
        if (!this._network) {
            const sett = this.getSettings();
            this._network = new Express({
                port: sett.getPort(),
                hostname: sett.getRootURLParsed().hostname,
                cors: sett.getAllowedOrigins(),
                publicFolder: sett.getPublicFolder(),
                registerMiddleware: eApp => {
                    eApp.use(spiderDetector.middleware());
                    eApp.get('*', async (req, res, next) => {
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
                },
                attachErrorHandler: eApp => {
                    eApp.use((error, req, res, next) => {
                        if (res.headersSent) {
                            return next(error);
                        }

                        const status = makeStatus(error.message);
                        res.status(status);

                        if (__DEV__) {
                            res.set('Content-Type', 'text/html');
                            res.send(
                                `<div style="white-space: pre-wrap">${
                                    error.stack
                                }</div>`,
                            );
                        } else {
                            res.send(status === 404 ? 'Not found' : 'Error');
                        }

                        return true;
                    });
                },
            });
        }

        return this._network;
    }

    useSSR(req) {
        if (!this.getSettings().useSSR()) {
            return false;
        }

        if (!_.isFunction(this.getParams().clientApplication)) {
            return false;
        }

        // todo: look at the user agent here
        return (
            (req.query && (!!req.query.__ssr || !!req.query.__srr)) ||
            req.isSpider()
        );
    }

    readSSRCache = async req => {
        return this.getCache().get(req.originalUrl);
    };

    storeSSRCache = async (data, req, res, extra) => {
        const page = _.get(extra, 'route.page');
        if (page && page.cacheable === false) {
            return;
        }

        await this.getCache().set(req.originalUrl, data.toString(), 60 * 5);
    };

    getCache() {
        if (!this._rendererCache) {
            const cache = new Cache();
            cache.init({
                url: this.getSettings().getSSRCacheURL(),
            });

            this._rendererCache = cache;
        }

        return this._rendererCache;
    }

    hasCache() {
        return !!this._rendererCache;
    }

    async getRenderer() {
        if (!this._renderer) {
            const Renderer = (await import('../renderer')).default;
            this._renderer = new Renderer({
                template: this.getTemplate(),
                clientApplication: this.getParams().clientApplication,
                settings: this.getSettings(),
            });

            if (_.isStringNotEmpty(this.getSettings().getSSRCacheURL())) {
                this._renderer.on('before', this.readSSRCache);
                this._renderer.on('after', this.storeSSRCache);
            }
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

    tearDown() {
        if (this.hasCache()) {
            this.getCache().tearDown();
        }
        super.tearDown();
    }
}
