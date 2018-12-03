import redis from 'redis';

export default class Cache {
    init(params = {}) {
        params = params || {};

        let client = null;
        const connectionString = params.url;
        if (!_.isStringNotEmpty(connectionString)) {
            throw new Error('"url" parameter is missing');
        }

        if (connectionString.startsWith('rediss://')) {
            client = redis.createClient(connectionString, {
                tls: { servername: new URL(connectionString).hostname },
            });
        } else {
            client = redis.createClient(connectionString);
        }

        this._client = client;
    }

    tearDown() {
        if (this._client) {
            this._client.quit();
        }
    }

    async set(key, data, ttl = 0) {
        return new Promise((resolve, reject) => {
            const cb = (err, res) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(res);
                }
            };

            if (ttl <= 0) {
                this._client.set(key, data, cb);
            } else {
                this._client.set(key, data, 'EX', ttl, cb);
            }
        });
    }

    async get(key) {
        return new Promise((resolve, reject) => {
            this._client.get(key, (err, res) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(res);
                }
            });
        });
    }

    async delete(key) {
        // todo
    }
}
