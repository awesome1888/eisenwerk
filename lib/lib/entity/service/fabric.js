export default class Fabric {
    static make(app, service) {
        const network = app.getNetwork();
        const serviceInstance = service.make(app);
        network.use(serviceInstance.getPath(), serviceInstance);

        const hooks = serviceInstance.getHooks();
        if (_.isObjectNotEmpty(hooks)) {
            network.service(serviceInstance.getName()).hooks(hooks.get());
        }
    }
}
