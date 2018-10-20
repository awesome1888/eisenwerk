import BaseApplication from '../../shared/lib/application/server/feathers.js';
import services from '../../shared/entity/services.js';
import methods from '../../shared/entity/methods.js';
import Entity from '../../shared/lib/entity/server.js';

export default class Application extends BaseApplication {
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

    /**
     * Attach custom routes and middleware, see examples commented-out
     */
    attachMiddleware() {
        super.attachMiddleware();

        const app = this.getNetwork();

        app.all('/', (req, res) => {
            res.status(200);
            res.send('Welcome');
        });
    }

    launch() {
        Entity.setNetwork(this.getNetwork());

        super.launch();
    }
}
