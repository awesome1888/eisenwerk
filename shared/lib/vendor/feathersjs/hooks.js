export default class Hooks {
    declare(hooks) {
        this._all = this._all || {};

        if (_.isObjectNotEmpty(hooks)) {
            Object.keys(hooks).forEach(k => {
                const v = hooks[k];

                if (_.contains(['before', 'after', 'error'], k)) {
                    this._all[k] = this._all[k] || {};

                    if (_.isObjectNotEmpty(v)) {
                        Object.keys(v).forEach(k1 => {
                            const v1 = v[k1];

                            if (
                                _.isArrayNotEmpty(v1) &&
                                _.contains(
                                    [
                                        'all',
                                        'find',
                                        'get',
                                        'create',
                                        'update',
                                        'patch',
                                        'remove',
                                    ],
                                    k1,
                                )
                            ) {
                                // this._all.before.all = ...
                                this._all[k][k1] = this._all[k][k1] || [];
                                v1.forEach(v1Hook => {
                                    this._all[k][k1].push(v1Hook);
                                });
                            }
                        });
                    }
                }
            });
        }
    }

    get() {
        return this._all || {};
    }
}
