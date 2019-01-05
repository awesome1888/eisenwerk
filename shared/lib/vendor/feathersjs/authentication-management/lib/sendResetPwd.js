'use strict';

var _slicedToArray = (function() {
    function sliceIterator(arr, i) {
        var _arr = [];
        var _n = true;
        var _d = false;
        var _e = undefined;
        try {
            for (
                var _i = arr[Symbol.iterator](), _s;
                !(_n = (_s = _i.next()).done);
                _n = true
            ) {
                _arr.push(_s.value);
                if (i && _arr.length === i) break;
            }
        } catch (err) {
            _d = true;
            _e = err;
        } finally {
            try {
                if (!_n && _i['return']) _i['return']();
            } finally {
                if (_d) throw _e;
            }
        }
        return _arr;
    }
    return function(arr, i) {
        if (Array.isArray(arr)) {
            return arr;
        } else if (Symbol.iterator in Object(arr)) {
            return sliceIterator(arr, i);
        } else {
            throw new TypeError(
                'Invalid attempt to destructure non-iterable instance',
            );
        }
    };
})();

/* eslint-env node */

var debug = require('debug')('authManagement:sendResetPwd');

var _require = require('./helpers'),
    getUserData = _require.getUserData,
    ensureObjPropsValid = _require.ensureObjPropsValid,
    getLongToken = _require.getLongToken,
    hashPassword = _require.hashPassword,
    getShortToken = _require.getShortToken,
    notifier = _require.notifier,
    concatIDAndHash = _require.concatIDAndHash;

module.exports = function sendResetPwd(options, identifyUser, notifierOptions) {
    debug('sendResetPwd');
    var users = options.app.service(options.service);
    var usersIdName = users.id;
    var sanitizeUserForClient = options.sanitizeUserForClient,
        skipIsVerifiedCheck = options.skipIsVerifiedCheck;

    var checkProps = skipIsVerifiedCheck ? [] : ['isVerified'];

    return Promise.resolve()
        .then(function() {
            ensureObjPropsValid(identifyUser, options.identifyUserProps);

            return Promise.all([
                users.find({ query: identifyUser }).then(function(data) {
                    return getUserData(data, checkProps);
                }),
                getLongToken(options.longTokenLen),
                getShortToken(options.shortTokenLen, options.shortTokenDigits),
            ]);
        })
        .then(function(_ref) {
            var _ref2 = _slicedToArray(_ref, 3),
                user = _ref2[0],
                longToken = _ref2[1],
                shortToken = _ref2[2];

            return Object.assign(user, {
                resetExpires: Date.now() + options.resetDelay,
                resetToken: concatIDAndHash(user[usersIdName], longToken),
                resetShortToken: shortToken,
            });
        })
        .then(function(user) {
            return notifier(
                options.notifier,
                'sendResetPwd',
                user,
                notifierOptions,
            ).then(function() {
                return user;
            });
        })
        .then(function(user) {
            return Promise.all([
                user,
                hashPassword(options.app, user.resetToken),
                hashPassword(options.app, user.resetShortToken),
            ]);
        })
        .then(function(_ref3) {
            var _ref4 = _slicedToArray(_ref3, 3),
                user = _ref4[0],
                longToken = _ref4[1],
                shortToken = _ref4[2];
            console.dir('token');

            console.dir(shortToken);
            console.dir(longToken);

            return patchUser(user, {
                resetExpires: user.resetExpires,
                resetToken: longToken,
                resetShortToken: shortToken,
            });
        })
        .then(function(user) {
            return sanitizeUserForClient(user);
        });

    function patchUser(user, patchToUser) {
        return users
            .patch(user[usersIdName], patchToUser, {}) // needs users from closure
            .then(function() {
                return Object.assign(user, patchToUser);
            });
    }
};
