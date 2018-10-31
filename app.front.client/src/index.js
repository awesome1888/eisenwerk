import 'babel-polyfill';
import Application from './application.js';

// make global modules visible in the browser
window.$ = $;
window._ = _;
window.t = t;

(new Application()).launch();
