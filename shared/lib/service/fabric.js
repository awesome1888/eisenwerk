export default class Fabric {
    static register(network, services) {
        services.forEach(service => {
            // make instance
            const serviceInstance = service.make(network);
            // define middleware
            network.use(serviceInstance.getPath(), serviceInstance);
            // apply hooks
            const hooks = serviceInstance.getHooks();
            if (_.isObjectNotEmpty(hooks)) {
                network.service(serviceInstance.getName()).hooks(hooks.get());
            }
        });
    }
}
