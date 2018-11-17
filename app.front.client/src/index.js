import 'babel-polyfill';
import ReactDOM from 'react-dom';
import Application from './application';

const application = new Application({
    redux: {
        initialState: window.__STATE__,
    },
});

delete window.__STATE__;

application.launch().then(() => {
    ReactDOM.render(
      application.render(),
      document.getElementById('root')
    );
});
