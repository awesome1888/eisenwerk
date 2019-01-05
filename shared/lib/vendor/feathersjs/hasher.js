const bcrypt = require('bcrypt');

const BCRYPT_DATE_BASE = 1483228800000;
const BCRYPT_WORK_INCREASE_INTERVAL = 47300000000;

module.exports = (password, baseFactor = 10) => {
    return new Promise((resolve, reject) => {
        const BCRYPT_CURRENT_DATE = new Date().getTime();
        const BCRYPT_WORK_INCREASE = Math.max(
            0,
            Math.floor(
                (BCRYPT_CURRENT_DATE - BCRYPT_DATE_BASE) /
                    BCRYPT_WORK_INCREASE_INTERVAL,
            ),
        );
        const BCRYPT_WORK_FACTOR = Math.min(
            19,
            baseFactor + BCRYPT_WORK_INCREASE,
        );

        bcrypt.genSalt(BCRYPT_WORK_FACTOR, (error, salt) => {
            if (error) {
                return reject(error);
            }

            bcrypt.hash(password, salt, (error1, hashedPassword) => {
                if (error1) {
                    return reject(error1);
                }

                resolve(hashedPassword);
            });
        });
    });
};
