import 'babel-polyfill';
import Application from './shared/lib/application/server/front-server.js';

(new Application({
    // clientApplication: () => import('../../app.front.client/src/application.js'),
})).launch();
