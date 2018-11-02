import BaseApplication from './express.js';
import fs from 'fs';
import ejs from 'ejs';
import settings from '../../settings/server.js';

export default class ServeBundleApplication extends BaseApplication {

    attachMiddleware() {
        super.attachMiddleware();
        this.getNetwork().get('*', this.getHandler.bind(this));
    }

    getHandler(req, res) {
        if (settings.isProduction()) {
            this.handleRequest(res);
        } else {
            try {
                this.handleRequest(res);
            } catch (e) {
                res.status(500);
                res.set('Content-Type', 'text/html');
                res.send(`<div style="white-space: pre-wrap">${e.stack}</div>`);
            }
        }
    }

    handleRequest(res) {
        res.status(200);
        res.set('Content-Type', 'text/html');
        res.send(this.getTemplate());
    }

    getTemplate() {
        if (!this._template) {
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
        if (!this._assetHTML) {
            const html = this.readTemplate('assets.html');
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
