import settings from '../../util/settings/server.js';
import process from 'process';

export default class Application {

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
}
