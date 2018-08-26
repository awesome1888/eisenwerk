const spawn = require('child_process').spawn;
const _ = require('underscore-mixin');

module.exports = class Util {
    static execute(cmd, args = [], params = {}) {
        if (!_.isArray(args)) {
            args = [];
        }

        const tool = params.tool || null;

        if (params.exposeCLI === true) {
            if (tool) {
                tool.log(`>> CALLED: ${cmd} ${args.join(' ')}`);
            }
        }

        return new Promise((resolve, reject) => {
            const handle = spawn(cmd, args);

            if (tool) {
                handle.stdout.on('data', (data) => {
                    tool.log(data.toString(), params);
                });
                handle.stderr.on('data', (data) => {
                    tool.log(data.toString(), params);
                });
            }

            handle.on('close', (code) => {
                if (code > 0) {
                    reject(code);
                } else {
                    resolve(code);
                }
            });
        });
    }
};
