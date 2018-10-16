const util = require('util');

const l = (arg) => {
    console.log(util.inspect(arg, {showHidden: false, depth: null}));
};

module.exports = l;
module.exports.default = l;
