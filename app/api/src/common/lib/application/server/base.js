import Settings from '../../util/settings/server.js';
import process from 'process';

export default class Application {
    async launch() {
        process.on('unhandledRejection', (reason, p) => {
            console.log('Unhandled Rejection at: ', p, ' reason: ', reason);
        });
        process.on('uncaughtException', (err) => {
            console.log('Uncaught Exception thrown ', err);
            this.tearDown();
        });

        this.attachBaseMiddleware();
        this.attachSpecialMiddleware();
        this.attachMiddleware();
        this.attachNotFoundMiddleware();

        this.createServer();
    }

    /**
     * Creates an app and attaches very basic middleware like bodyparser and helmet
     */
    attachBaseMiddleware() {
    }

    /**
     * Attaches a higher-level yet special middleware like REST
     */
    attachSpecialMiddleware() {
    }

    /**
     * Attaches the middleware of your choince, meant to be re-defined in the descendant classes
     */
    attachMiddleware() {
    }

    /**
     * Attaches the final middleware, basically the 404 middlware
     */
    attachNotFoundMiddleware() {
    }

    // getRoutes() {
    //     return [];
    // }

    createServer() {
        const port = Settings.getInstance().getPort();

        this._server = this.getNetwork().listen(port);
        this._server.on('listening', () => {
            console.log(`Listening ${port} port`);
        });
    }

    getNetwork() {
        return null;
    }

    getSettings() {
        return Settings.getInstance();
    }

    isProduction() {
        return this.getSettings().isProduction();
    }

    tearDown() {
        process.exit(1);
    }
}
