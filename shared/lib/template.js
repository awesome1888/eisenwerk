import fs from 'fs';
import ejs from 'ejs';

export default class Template {

    constructor({settings}) {
        this._settings = settings;
    }

    get(data = {}) {
        if (!_.isObject(data)) {
            data = {};
        }

        if (data.dry) {
            data.settings = JSON.stringify({});
        } else {
            data.settings = data.settings ? JSON.stringify(data.settings) : this._settings.prepareForClient();
        }
        data.overlay = this.getOverlayHTML();
        data.assets = {
            js: data.dry ? '' : this.getAssetHTML().js,
            css: this.getAssetHTML().css,
            overlay: this.getOverlayAssets(),
        };

        data.title = data.title || this._settings.env.PROJECT__NAME || '';
        data.description = data.description || '';
        data.keywords = data.keywords || '';
        data.body = data.body || '';

        return ejs.render(this.getMain(), data);
    }

    getAssetHTML() {
        // if not cached or not in production
        if (!this._assetHTML) {
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

    getMain() {
        if (!this._main) {
            this._main = this.readTemplateRelative('main.ejs');
        }

        return this._main;
    }

    getOverlayAssets() {
        if (!this._overlayAssets) {
            this._overlayAssets = this.readTemplateRelative('overlay/assets.ejs');;
        }

        return this._overlayAssets;
    }

    getOverlayHTML() {
        if (!this._overlayHTML) {
            this._overlayHTML = this.readTemplateRelative('overlay/html.ejs');
        }

        return this._overlayHTML;
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
