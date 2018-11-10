import BaseApplication from './express.js';
import fs from 'fs';
import ejs from 'ejs';

export default class FrontServerApplication extends BaseApplication {

    useSSR(res) {
        if (!this.getSettings().useSSR()) {
            return false;
        }

        // todo: check for res
        return true;
    }

    /**
     * Import reducers here, sagas, store and pages
     * @returns {{}}
     */
    getFrontendPart() {
        return {};
    }

    async getRenderer() {
        if (!this._renderer) {
            const Renderer = (await import('../../renderer')).default;
            this._renderer = new Renderer(this.getFrontendPart());
        }

        return this._renderer;
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
                res.send(this.getTemplate());
            }
        });
    }

    attachErrorHandler() {
        const app = this.getNetwork();

        // dont remove "next", because...
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

    getTemplate() {
        // if not cached or not in production
        if (!this._template || !this.getSettings().isProduction()) {
            const main = this.readTemplate('main.ejs');

            this._template = ejs.render(main, {
                settings: this.getSettings().prepareForClient(),
                overlay: this.getOverlayHTML(),
                assets: {
                    js: this.getAssetHTMLJS(),
                    css: this.getAssetHTMLCSS(),
                    overlay: this.getOverlayAssets(),
                },
            });
        }

        return this._template;
    }

    getAssetHTMLJS() {
        return this.getAssetHTML().js;
    }

    getAssetHTMLCSS() {
        return this.getAssetHTML().css;
    }

    getAssetHTML() {
        // if not cached or not in production
        if (!this._assetHTML || !this.getSettings().isProduction()) {
            const html = this.readTemplate('../assets.html');
            const assets = {js: '', css: ''};

            let found = html.match(new RegExp('<!-- JS -->\n*(.+)\n*<!-- JS:END -->'));
            if (_.isArrayNotEmpty(found) && _.isStringNotEmpty(found[1])) {
                assets.js = found[1];
            }

            found = html.match(new RegExp('<!-- CSS -->\n*(.+)\n*<!-- CSS:END -->'));
            if (_.isArrayNotEmpty(found) && _.isStringNotEmpty(found[1])) {
                assets.css = found[1];
            }

            this._assetHTML = assets;
        }

        return this._assetHTML;
    }

    getOverlayAssets() {
        return this.readTemplate('overlay/assets.ejs');
    }

    getOverlayHTML() {
        return this.readTemplate('overlay/html.ejs');
    }

    readTemplate(file) {
        let folder = this.getSettings().getTemplateFolder();
        if (!_.isStringNotEmpty(folder)) {
            folder = `${this.getSettings().getRootFolder()}/template/`;
        }
        return fs.readFileSync(`${folder}/${file}`).toString('utf8');
    }
}
