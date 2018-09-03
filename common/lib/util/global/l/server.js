const util = require('util');

const l = (arg, depth = null) => {
    console.log(util.inspect(arg, {showHidden: false, depth}));
};

module.exports = l;
module.exports.default = l;
