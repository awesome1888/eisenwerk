import BaseApplication from './shared/lib/application/server/feathers.js';
import services from './shared/entity/services.js';
import methods from './shared/entity/methods.js';
import Entity from './shared/lib/entity/server.js';
import LordVader from './img/vader';
import Yoda from './img/yoda';

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
            if (this.getSettings().isProduction()) {
                res.send(`<pre>${LordVader}</pre>`);
            } else {
                res.send(`
                    <style>body{font-family: sans-serif}</style>
                    <pre>${Yoda}</pre>
                    <h3>The entities following use you may, young padawan:</h3>
                    <ul>
                        ${this.getServices().map((service) => {
                            return `<li><a href="${service.getPath()}">${service.getPath()}</a> &mdash; ${service.getDesciption()}</li>`;
                        }).join('')}
                    </ul>
                `);
            }
        });
    }

    launch() {
        Entity.setNetwork(this.getNetwork());
        super.launch();
    }
}
