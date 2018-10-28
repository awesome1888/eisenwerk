import Access from '../access/server.js';
import Error from '../error';
import Context from '../context';

export default class Fabric {
    static register(app, declarations = []) {
        const allMethods = this.flattenMethods(declarations);
        app.getNetwork().use('/method', {
            create: async (data, context) => {
                let result = {};

                if (_.isObjectNotEmpty(data)) {
                    const name = data.method;
                    const args = data.arguments || [];

                    if (_.isStringNotEmpty(name)) {

                        // make aligned with hook context structure
                        context = {params: context, method: {name, arguments: args}};

                        const pack = allMethods[name];
                        const declared = pack.getDeclaration()[name];
                        if (_.isObjectNotEmpty(declared)) {
                            const body = this.makeBody(pack, name, declared);
                            result = await body(args, context, app);
                        } else {
                            Error.throw400(`Method not found: ${name}`);
                        }
                    }
                }

                return result;
            },
        });
    }

    static flattenMethods(declarations) {
        const all = {};
        declarations.forEach((pack) => {
            _.forEach(pack.getDeclaration(), (info, name) => {
                all[name] = pack;
            });
        });

        return all;
    }

    static makeBody(Methods, name, declaration) {
        return async (args, context, application) => {
            const bodyName = declaration.body;
            if (!_.isStringNotEmpty(bodyName)) {
                Error.throw400(`No body for the method: ${name}`);
            }

            const instance = new Methods();
            if (!_.isFunction(instance[bodyName])) {
                Error.throw400(`The body is not a function for the method: ${name}`);
            }

            // check access
            const rule = declaration.access;

            if (!_.isObjectNotEmpty(rule) || !('deny' in rule)) {
                // no rule specified or was not explicitly allowed -> deny
                Error.throw403();
            }

            const auth = application.getAuthorization();
            const result = await Access.testToken(Context.extractToken(context), rule, auth, context);

            if (result === false) {
                Error.throw403();
            }

            if (_.isObjectNotEmpty(result) && result.error) {
                return result.error;
            }

            instance.setApplication(application);
            instance.setContext(context);

            const methodResult = await instance[bodyName](...args);
            if (!_.isUndefined(methodResult)) {
                return methodResult;
            }

            return true;
        };
    }
}
