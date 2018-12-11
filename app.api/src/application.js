import APIServer from './shared/lib/application/FeathersAPIServer';
import services from './shared/api/services';
import methods from './shared/api/methods';
import Entity from './shared/lib/entity/server';
import User from './shared/api/user/entity/server';

export default class Application extends APIServer {
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

    getUserEntity() {
        return User;
    }

    launch() {
        Entity.setNetwork(this.getNetwork());
        super.launch();
    }
}
