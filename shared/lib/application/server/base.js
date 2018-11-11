import settings from '../../settings/server.js';
import process from 'process';

export default class Application {

    constructor(params = {}) {
        this._params = params;
    }

    getNetwork() {
        throw new Error('Not implemented: .getNetwork()');
    }

    async launch() {
        process.on('unhandledRejection', (reason, p) => {
            console.log('Unhandled Rejection at: ', p, ' reason: ', reason);
        });
        process.on('uncaughtException', (err) => {
            console.log('Uncaught Exception thrown ', err);
            this.tearDown();
        });

        this.getSettings().checkMandatory();

        this.attachMiddleware();
        this.attachErrorTrigger();
        this.attachErrorHandler();

        this.createServer();
    }

    /**
     * Attaches the middleware of your choince, meant to be re-defined in the descendant classes
     */
    attachMiddleware() {
    }

    /**
     * Attaches the final middleware, basically the 404 middlware
     */
    attachErrorHandler() {
    }

    attachErrorTrigger() {
        // if nothing were served above with GET, then we should obviously send 404
        this.getNetwork().get(() => {
            throw new Error('404');
        });
        // all the rest - not implemented
        this.getNetwork().use(() => {
            throw new Error('501');
        });
    }

    createServer() {
        const port = this.getSettings().getPort();
        this._server = this.getNetwork().listen(port);
        this._server.on('listening', () => {
            console.log(`Listening on ${port} port`);
        });
    }

    tearDown() {
        process.exit(1);
    }

    getSettings() {
        return settings;
    }

    getParams() {
        return this._params;
    }
}
