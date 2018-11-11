import fs from 'fs';
import ejs from 'ejs';

export default class Template {

    constructor({settings}) {
        this._settings = settings;
    }

    get() {
        // if not cached or not in production
        if (__DEV__ || !this._template) {
            const main = this.readTemplateRelative('main.ejs');

            this._template = ejs.render(main, {
                settings: this._settings.prepareForClient(),
                overlay: this.getOverlayHTML(),
                assets: {
                    js: this.getAssetHTML().js,
                    css: this.getAssetHTML().css,
                    overlay: this.getOverlayAssets(),
                },
            });
        }

        return this._template;
    }

    getAssetHTML() {
        // if not cached or not in production
        if (__DEV__ || !this._assetHTML) {
            const html = this.readTemplate(this.getAssetsFilePath());
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
        return this.readTemplateRelative('overlay/assets.ejs');
    }

    getOverlayHTML() {
        return this.readTemplateRelative('overlay/html.ejs');
    }

    getAssetsFilePath() {
        let fPath = this._settings.getAssetsFilePath();
        if (!_.isStringNotEmpty(fPath)) {
            fPath = `${this.getTemplateFolder()}/../assets.html`;
        }

        return fPath;
    }

    getTemplateFolder() {
        let folder = this._settings.getTemplateFolder();
        if (!_.isStringNotEmpty(folder)) {
            folder = `${this._settings.getRootFolder()}/template/`;
        }

        return folder;
    }

    readTemplateRelative(file) {
        return this.readTemplate(`${this.getTemplateFolder()}/${file}`);
    }

    readTemplate(path) {
        return fs.readFileSync(path).toString('utf8');
    }
}
