/* eslint-disable global-require */

const gulp = require('gulp');
const BuildTool = require('./../build-tool/index.js');

const api = require('./../app/api/gulp.js');
const desktop = require('./../app/desktop/gulp.js');

const tool = new BuildTool({
    gulp,
    composeFile: `${__dirname}/../docker/app.dev.yml`,
    // exposeCLI: true,
    dockerLogsPolling: true,
    dockerLogsPollingInterval: 2000,
    applications: {
        'ew.dev.api': api,
        'ew.dev.desktop': desktop,
    },
});

gulp.task('default', tool.prepare());
