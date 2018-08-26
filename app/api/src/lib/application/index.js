import BaseApplication from '../../common/lib/application/server/base-feathers.js';
import services from '../../common/entity/services.js';
import methods from '../../common/entity/methods.js';
import Entity from '../../common/lib/entity/server.js';

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
        const express = this.getNetwork();
        express.all('/', (req, res) => {
            res.status(200);
            res.send('Welcome');
        });

        // express.get('/demo-get', (req, res) => {
        //
        //     // will contain parsed GET query string
        //     console.log(req.query);
        //
        //     // will contain parsed body of POST query in case if
        //     // Content-Type === x-www-form-urlencoded OR Content-Type === application/json
        //     // was used
        //     console.dir(req.body);
        //
        //     res.send('Hey gotcha');
        // });
        //
        // express.use('/demo-middleware', (req, res, next) => {
        //     console.log('Request Type:', req.method);
        //     next();
        // });
        //
        // attach secured middleware
        // todo: write some examples
    }

    launch() {
        mern.setApp(this);
        Entity.setNetwork(this.getNetwork());

        super.launch();
    }
}
