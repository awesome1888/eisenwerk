import Users from '../entity/server.js';
import UserProcessor from '../../mapping/util/user-processor/index.js';

export default class MappingHook {
    static async declare(hooks) {
        hooks.declare({
            before: {
                patch: [
                    async (context) => {
                        const id = context.id;
                        const data = context.data;

                        // get the previous data
                        const prevData = await Users.get(id, {
                            lean: true,
                        });

                        const mp = new UserProcessor();
                        await mp.process(id, data, prevData);
                    }
                ],
            },
        });
    }
}
