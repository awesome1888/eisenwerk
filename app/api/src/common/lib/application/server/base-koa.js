import Koa from 'koa';
import helmet from 'koa-helmet';
import ResponseTime from 'koa-response-time';
import ETag from 'koa-etag';
import BodyParser from 'koa-bodyparser';
import ConditionalGet from 'koa-conditional-get';
import Static from 'koa-static';
import Mount from 'koa-mount';
import Router from 'koa-router';
import errorHandler from 'koa-better-error-handler';
import koa404Handler from 'koa-404-handler';

import BaseApplication from './base.js';
import Settings from '../../util/settings/server.js';

import AuthorizationOAuthSuccessCallback from '../../util/authorization/oauth2-success.js';

export default class BaseKoaApplication extends BaseApplication {

    getNetwork() {
        if (!this._koa) {
            this._koa = new Koa();
        }

        return this._koa;
    }

    getRouter() {
        if (!this._router) {
            this._router = new Router();
        }

        return this._router;
    }

    attachBaseMiddleware() {
        const app = this.getNetwork();

        app.use(helmet());
        app.use(ResponseTime());
        app.use(ConditionalGet());
        app.use(ETag());
        // app.use(Morgan('combined'));

        app.use(BodyParser({
            // BodyParser options here
        }));

        const pFolder = Settings.getInstance().getPublicFolder();
        if (pFolder !== false) {
            app.use(Mount('/public', Static(pFolder)));
            // if nothing were served by Static, and we are still here, then we should obviously send 404
            app.use(Mount('/public', (ctx) => {
                ctx.throw(404, 'Not found');
            }));
        }

        app.context.onerror = errorHandler;
    }

    attachSpecialMiddleware() {
        AuthorizationOAuthSuccessCallback.attach(this);
    }

    attachMiddleware() {
        const app = this.getNetwork();
        app.use(this.getRouter().routes());
    }

    attachNotFoundMiddleware() {
        const app = this.getNetwork();

        app.use(koa404Handler);
    }
}
