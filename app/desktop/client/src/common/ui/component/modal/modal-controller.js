import EventEmitter from '../../../lib/util/event/event.js';
import { withRouter } from 'react-router';

class ModalController {
    static open(...params) {
        EventEmitter.emit('open-modal', ...params);
    }

    static close() {
        EventEmitter.emit('close-modal');
    }

    static isOpened() {
        console.dir('modal.isOpened');
        console.dir(this.props);

        // return _.getValue(FlowRouter.current(), 'queryParams.modal');
    }
}

export default withRouter(ModalController);
