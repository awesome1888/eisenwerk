export default class LanguageController {
    static getLanguage() {
        // todo: now we have user in the store, so we need to update this somehow
        // const connectedUser = mern.app().hasUser() && mern.app().getUser().getLanguage();
        // return connectedUser || this._language || 'en';

        return 'en';
    }

    static setLanguage(lng) {
        this._language = lng;
    }
}
