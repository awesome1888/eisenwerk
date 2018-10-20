#!/usr/bin/env node

const process = require('process');
const Project = require('docker-build-tool');

process.on('unhandledRejection', (reason, p) => {
	console.log('Unhandled Rejection at: ', p, ' reason: ', reason);
});
process.on('uncaughtException', (err) => {
	console.log('Uncaught Exception thrown ', err);
	console.dir(err.stack);
});

(new Project({
    name: 'replace-this', // todo: derive it
    composeFile: `${__dirname}/../docker/development.yml`, // todo: make it relative
    projectFolder: `${__dirname}/../`,
    dockerLogsPollingInterval: 1000,
})).run();
