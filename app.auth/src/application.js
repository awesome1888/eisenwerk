import Server from './shared/lib/application/api.server';
import Authentication from './shared/lib/authentication/token-issuer.server';
import Entity from './shared/lib/entity/server';
import User from './shared/api/user/entity/server';
import UserService from './shared/api/user/feathersjs/service';

export default class Application extends Server {
    /**
     * Return services according to which the REST API will be auto-generated
     * @returns {*[]}
     */
    getServices() {
        return [UserService];
    }

    getUserEntity() {
        return User;
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
