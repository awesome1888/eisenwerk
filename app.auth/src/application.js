import FeathersAPIServer from './shared/lib/application/FeathersAPIServer';
import Entity from './shared/lib/entity/server';
import User from './shared/api/user/entity/server';
import UserService from './shared/api/user/feathersjs/service';
import Authentication from './shared/lib/authentication/auth-server';

export default class Application extends FeathersAPIServer {
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
