import BaseApplication from './express.js';
import fs from 'fs';
import ejs from 'ejs';

export default class ServeBundleApplication extends BaseApplication {

    attachMiddleware() {
        super.attachMiddleware();
        // todo: instead of just putting * we need to check here if we are trying to get a route-like url
        // todo: i.e. /something/like/that/, but /blah.jpg will not be the case
        this.getNetwork().get('*', (req, res) => {
            res.status(200);
            res.set('Content-Type', 'text/html');
            res.send(this.getTemplate());
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
        return fs.readFileSync(`${this.getSettings().getRootFolder()}/template/${file}`).toString('utf8');
    }
}
