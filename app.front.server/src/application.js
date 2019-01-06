import Server from './shared/lib/application/web.server';
import Authentication from './shared/lib/authentication/web.server';

export default class Application extends Server {
    /**
     * this is for SSR
     * @returns {function(): (Promise<*>|*)}
     */
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
            this._auth.attach();
        }

        return this._auth;
    }
}
