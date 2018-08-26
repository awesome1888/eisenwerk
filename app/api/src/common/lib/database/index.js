/* eslint-disable no-await-in-loop */

import mongoose from 'mongoose';

export default class Database {
    async connect(url, options = {}) {
        if (!_.isStringNotEmpty(url)) {
            throw new Error('No URL provided');
        }

        mongoose.Promise = global.Promise;

        const retries = options.DB_CONNECTION_RETRIES || 3;
        const tmout = options.DB_CONNECTION_TIMEOUT || 1000;

        let connection = null;
        for (let t = 0; t < retries - 1; t++) {
            try {
                connection = await mongoose.connect(url);
                t = retries + 1; // exit cycle

                console.log('DB connection established');
            } catch (e) {
                await new Promise((resolve) => {
                    setTimeout(resolve, tmout);
                });
            }
        }

        if (!connection) {
            throw new Error('Database connection failed');
        }

        this._connection = connection;
    }

    async disconnect() {
        this._connection.disconnect();
    }
}
