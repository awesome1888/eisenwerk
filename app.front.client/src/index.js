import 'babel-polyfill';
import Application from './application.js';

// make global modules visible in the browser
window._ = _;

(new Application()).launch();
