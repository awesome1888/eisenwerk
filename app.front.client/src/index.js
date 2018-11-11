import 'babel-polyfill';
import ReactDOM from 'react-dom';
import Application from './application.js';

const application = new Application();
application.launch().then(() => {
    ReactDOM.render(
      application.getUI(),
      document.getElementById('root')
    );
});
