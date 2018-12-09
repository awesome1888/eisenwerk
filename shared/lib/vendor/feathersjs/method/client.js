export default class Method {
    static execute(name, args) {
        return this.getNetwork()
            .service('method')
            .create({
                method: name,
                arguments: args,
            });
    }

    static getNetwork() {
        return this._network;
    }

    static setNetwork(network) {
        this._network = network;
    }
}
