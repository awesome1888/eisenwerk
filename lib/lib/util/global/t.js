const t = (message, ...args) => {
    if (_.isArray(args) && args.length > 0) {
        // break string into tokens and remove special tokens
        // Eg: Word1 word2 $(0) word3 Should return: ['Word1 word2 ', ' word3']
        const tokens = message.split(/\$\([0-9]*\)/);
        // merge arrays alternatively
        return tokens.reduce((arr, v, i) => arr.concat(v, args[i]), []);
    }
    return message;
};

module.exports = t;
module.exports.default = t;
