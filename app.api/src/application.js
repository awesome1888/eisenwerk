import Server from './shared/lib/application/api.server';
import Authentication from './shared/lib/authentication/api.server';
import services from './shared/api/services';
import methods from './shared/api/methods';
import Entity from './shared/lib/entity/server';
import User from './shared/api/user/entity/server';

export default class Application extends Server {
    /**
     * Return services according to which the REST API will be auto-generated
     * @returns {*[]}
     */
    getServices() {
        return services;
    }

    getMethods() {
        return methods;
    }

    getAuthentication(network = null) {
        if (!this._auth) {
            this._auth = new Authentication({
                network: network || this.getNetwork(),
                settings: this.getSettings(),
                userEntity: User,
            });
            this._auth.attach();
        }

        return this._auth;
    }

    launch() {
        Entity.setNetwork(this.getNetwork());
        super.launch();
    }
}
