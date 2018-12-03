import redis from 'redis';

export default class Cache {
    constructor(params = {}) {
        this._params = params;
    }

    init() {
        let client = null;
        const connectionString = this._params.url;

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
        console.dir('SET!');
    }

    async get(key) {
        console.dir('GET!');
    }

    async delete(key) {}
}
