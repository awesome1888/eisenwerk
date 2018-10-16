import User from '../../user/entity/server.js';
import Util from '../../../lib/util/index.js';

export default class UserLinkHook {
    static async declare(hooks) {
        hooks.declare({
            before: {
                remove: [
                    async (context) => {
                        const user = await User.findOne({filter: {
                            'data.companyId': ObjectId(context.id)
                        }});
                        if (!_.isEmpty(user)) {
                            const userId = user.getId().toString();

                            if (Util.isId(userId)) {
                                await User.save(userId, {
                                    $unset: {'data.companyId': ''}
                                });
                            }
                        }
                    }
                ]
            },
        });
    }
}
