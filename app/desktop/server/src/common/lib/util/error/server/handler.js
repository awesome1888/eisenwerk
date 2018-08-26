import errors from '@feathersjs/errors';

export default function (params = {}) {

    params = params || {};
    const isProduction = params.isProduction;

    // dont remove "next", because...
    // https://expressjs.com/en/guide/using-middleware.html#middleware.error-handling
    return (error, req, res, next) => {
        if (error) {
            if (error.type !== 'FeathersError') {
                const oldError = error;
                error = new errors.GeneralError(oldError.message, {
                    errors: oldError.errors
                });

                if (oldError.stack) {
                    error.stack = oldError.stack;
                }
            }

            if (!isProduction) {
                delete error.hook; // tl,dr
                console.dir(error);
            }

            const output = Object.assign({}, error.toJSON());

            if (!isProduction) {
                if (_.isStringNotEmpty(error.stack)) {
                    output.stack = error.stack.split("\n");
                }
            }

            res.status(error.code);
            res.set('Content-Type', 'application/json');
            res.json(output);
            res.end();
        } else {
            res.end();
        }
    };
}
