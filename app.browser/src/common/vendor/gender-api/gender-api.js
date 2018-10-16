import axios from 'axios';

export default class {

    static async getByName(fullName) {
        const key = mern.app().getSettings().getGenderAPIToken();
        const url = `https://gender-api.com/get?split=${encodeURIComponent(fullName)}&key=${key}`;
        return axios.get(url)
            .then((response) => {
                if (response.status === 200 && !_.isEmpty(response.data)) {
                    return response.data.gender || '';
                }
                return '';
            })
            .catch((error) => {
                console.log(error);
            });
    }
}
