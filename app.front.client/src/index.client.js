import 'babel-polyfill';
import ReactDOM from 'react-dom';
import Application from './application.js';

const application = new Application();
application.launch();

// on the client side we render it as normal react app
ReactDOM.render(
  application.getUI(),
  document.getElementById('root')
);
