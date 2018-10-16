import ConfirmModal from '../../../ui/component/confirm-modal/confirm-modal.jsx';

// stops the user from leaving an unsaved form
export default class FormControlSystem {
    constructor(disabled) {
        this.disabled = disabled; // disabled this functionality
        this.dirtyFlag = false; // has the form been edited?
        this.formSubmitting = false; // is the form submitting?
    }

    /** * Determine if the current model is dirty
     * @params {object} oldModel - initial state of the form
     * @params {object} currentModel - current state of the form
     */
    checkDirty(oldModel, currentModel) {
        oldModel = this.stripSystemFields(_.deepClone(oldModel));
        currentModel = this.stripSystemFields(_.deepClone(currentModel));
        return !_.deepEqual(oldModel, currentModel);
    }

    /** * Pops alert when current window is closed
     * @params {object} e - event
     */
    onUnload(e) {
        if (this.disabled) {
            return null;
        }

        if (this.formSubmitting || !this.dirtyFlag) { // should a message appear?
            return undefined; // no
        }

        (e || window.event).returnValue = this.getMessage();

        return this.getMessage(); // yes
    }

    /** * Sets dirtyFlag true or false
     * @params {object} oldModel - initial state of the form
     * @params {object} currentModel - current state of the form
     */
    setDirty(oldModel, currentModel) {
        this.dirtyFlag = this.checkDirty(oldModel, currentModel);
        return this.dirtyFlag;
    }

    isDirty() {
        return this.dirtyFlag;
    }

    getMessage() {
        return 'It looks like you have been editing something. If you leave before saving, your changes will be lost.';
    }

    /** * Sets submittingFlag true or false
     * @params {boolean} value - new value of submittingFlag
     */
    setSubmitting(value) {
        this.formSubmitting = value;
    }

    /** * Adds onbeforeunlnload trigger to window object
     */
    onMount() {
        window.onbeforeunload = this.onUnload.bind(this);
    }

    /** * Removes onbeforeunlnload trigger to window object
     * Emits form-clean event when done
     */
    onUnmount() {
        window.onbeforeunload = undefined;
    }

    /** Pops alert if needed on go back button
     * @params {function} func - function to be called if checks pass
     */
    confirmUnload() {
        return new Promise((resolve, reject) => {
            if (this.disabled || !this.dirtyFlag) { // if the form has not been edited, proceed as normal
                resolve();
            } else {
                ConfirmModal.open({
                    isModal: true,
                    onConfirmClick: resolve,
                    onClose: reject,
                    cancelButtonLabel: t('Leave'),
                    headerText: t('Are you sure?'),
                    text: t('It seems like you edited something. If you leave this page without saving, your changes will be lost.'),
                }, {
                    showCloseButton: false,
                    size: 'S'
                });
            }
        });
    }

    /**
     * Remove auto-generated __id field from the entire thing
     * @param obj
     * @param depth
     * @returns {*}
     */
    stripSystemFields(obj, depth = 1) {
        // dont go over the threshold
        if (depth > 20 || !_.isExist(obj)) {
            return obj;
        }

        const keys = Object.keys(obj);
        let key;

        for (let k = 0; k < keys.length; k++) {
            key = keys[k];
            if (key === '__id') {
                delete obj[key];
            } else {
                if (_.isPlainObject(obj[key])) {
                    obj[key] = this.stripSystemFields(obj[key], depth + 1);
                } else if (_.isArrayNotEmpty(obj[key])) {
                    for (let m = 0; m < obj[key].length; m++) {
                        obj[key][m] = this.stripSystemFields(obj[key][m], depth + 1);
                    }
                }
            }
        }

        return obj;
    }
}
