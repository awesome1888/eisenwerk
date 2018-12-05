import 'babel-polyfill';
import Application from './shared/lib/application/front';

new Application({
    clientApplication: () =>
        import('../../app.front.client/src/application.js'),
    routes: () => import('../../app.front.client/src/routes/map'),
}).launch();
