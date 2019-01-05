import hasher from '../hasher';
import merge from 'lodash.merge';
import get from 'lodash.get';
import set from 'lodash.set';
import cloneDeep from 'lodash.cloneDeep';

export default (options = {}) => {
    return context => {
        if (context.type !== 'before') {
            return Promise.reject(
                new Error(
                    "The 'hashPassword' hook should only be used as a 'before' hook.",
                ),
            );
        }

        const app = context.app;
        const authOptions = app.get('authentication') || {};

        options = merge(
            { passwordField: 'password' },
            authOptions.local,
            options,
        );

        const field = options.passwordField;
        const hashPw = options.hash || hasher;

        if (typeof field !== 'string') {
            return Promise.reject(
                new Error(
                    "You must provide a 'passwordField' in your authentication configuration or pass one explicitly",
                ),
            );
        }

        if (typeof hashPw !== 'function') {
            return Promise.reject(
                new Error(
                    "'hash' must be a function that takes a password and returns Promise that resolves with a hashed password.",
                ),
            );
        }

        if (context.data === undefined) {
            return Promise.resolve(context);
        }

        const dataIsArray = Array.isArray(context.data);
        const data = dataIsArray ? context.data : [context.data];

        return Promise.all(
            data.map(item => {
                const password = get(item, field);
                if (password) {
                    return hashPw(password).then(hashedPassword =>
                        set(cloneDeep(item), field, hashedPassword),
                    );
                }

                return item;
            }),
        ).then(results => {
            context.data = dataIsArray ? results : results[0];

            return context;
        });
    };
};
