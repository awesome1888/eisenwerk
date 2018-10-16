import Company from '../../company/entity/server.js';
import Util from '../../../lib/util/index.js';

export default class CompanyLinkHook {
    static async declare(hooks) {
        hooks.declare({
            before: {
                patch: [
                    async (context) => {
                        const companyId = _.getValue(context, 'result.data.companyId') || context.data['data.companyId'];

                        if (Util.isId(companyId)) {
                            const oldUser = context.__previous;
                            const oldCompanyId = oldUser.getCompanyId().toString();

                            if (companyId !== oldCompanyId) {
                                await Company.save(oldCompanyId, {
                                    $pull: {
                                        employers: context.id
                                    }
                                });

                                await Company.save(companyId, {
                                    $addToSet: {
                                        employers: context.id
                                    }
                                });
                            }
                        }
                    }
                ],
                remove: [
                    async (context) => {
                        const company = await Company.findOne({
                            employers: context.id
                        });
                        const companyId = company.getId().toString();

                        if (Util.isId(companyId)) {
                            await Company.save(companyId, {
                                $pull: {
                                    employers: context.id
                                }
                            });
                        }
                    }
                ]
            },
            after: {
                create: [
                    async (context) => {
                        let companyId = _.getValue(context, 'result.data.companyId');
                        if (!_.isUndefined(companyId)) {
                            companyId = companyId.toString();



                            if (Util.isId(companyId)) {
                                await Company.save(companyId, {
                                    $addToSet: {
                                        employers: context.result._id
                                    }
                                });
                            }
                        }
                    }
                ],
            },
        });
    }
}
