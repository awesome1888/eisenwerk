export default class Fabric {
    static register(app, services) {
        const network = app.getNetwork();
        services.forEach((service) => {
            // make instance
            const serviceInstance = service.make(app);
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
