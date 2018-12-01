import Access from './access/both';

const redirector = (params = {}) => {
    let whereTo = null;

    if (_.isObjectNotEmpty(params.redirect)) {
        Object.keys(params.redirect).forEach(url => {
            const condition = params.redirect[url];

            if (whereTo) {
                return;
            }

            if (
                (_.isFunction(condition) && !!condition()) ||
                (!_.isFunction(condition) && !!condition)
            ) {
                whereTo = url;
            }
        });
    } else if (_.isFunction(params.redirect)) {
        whereTo = params.redirect(params);
    }

    if (!whereTo && params.useAuth) {
        const ra = params.redirectAuthorized;
        const rna = params.redirectNotAuthorized;

        if (!params.user && _.isStringNotEmpty(rna)) {
            whereTo = rna;
        }

        if (params.user && _.isStringNotEmpty(ra)) {
            whereTo = ra;
        }

        if (!whereTo) {
            // check the route access
            const access = params.access;
            const user = params.user;

            if (_.isObjectNotEmpty(access)) {
                const test = Access.testRoute(user, access);
                /**
                 * todo: you wont be able to make custom checks async while make checks in render(). Think of better way!
                 */
                if (test instanceof Promise) {
                    throw new Error(
                        'Async access check is not currently supported',
                    );
                }
                if (!test) {
                    whereTo = '/403';
                }
            }
        }
    }

    return whereTo;
};

export default redirector;
