import 'babel-polyfill';
import ReactDOMServer from 'react-dom/server';
import Application from './application.js';

const application = new Application();
application.launch();

// on the server side we render it into a static markup
ReactDOMServer.renderToString(
  application.getUI()
);
