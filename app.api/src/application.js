import APIServer from './shared/lib/application/FeathersAPIServer';
import services from './shared/api/services.js';
import methods from './shared/api/methods.js';
import Entity from './shared/lib/entity/server.js';

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

    launch() {
        Entity.setNetwork(this.getNetwork());
        super.launch();
    }
}
