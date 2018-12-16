import WebServer from './shared/lib/application/WebServer';
import Authentication from './shared/lib/authentication/front-server';

export default class Application extends WebServer {
    getClientApplicationConstructor() {
        return () => import('../../app.front.client/src/application.js');
    }

    getRoutes() {
        return () => import('../../app.front.client/src/routes/map');
    }

    getAuthentication(network = null) {
        if (!this._auth) {
            this._auth = new Authentication({
                network: network || this.getNetwork(),
                settings: this.getSettings(),
            });
            this._auth.prepare();
        }

        return this._auth;
    }
}
