/* eslint-disable */

const path = require('path');
const ExternalsPlugin = require('webpack2-externals-plugin');
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');
const webpack = require('webpack');

/**
 *
 * @param context
 * @returns {string}
 */
const getSrcFolder = (context) => {
	return `${context.getProjectFolder()}/app.front.server/`;
};

/**
 *
 * @returns {{analyzeBundle: boolean}}
 */
const getParameters = () => {
	return {
        copyPackageJson: true, // copy package.json to a target build folder, in order to access it with Dockerfile
	};
};

/**
 *
 * @param context
 * @returns {Promise<{mode, target: string, entry: string, output: {filename: string, path: *, libraryTarget: string}, resolve: {symlinks: boolean}, plugins: *[]}>}
 */
const getWebpackConfiguration = async (context) => {

    const srcFolder = context.getTaskSrcFolder();
    const dstFolder = await context.makeTaskDstFolder();

    return {
        // in the production mode webpack will minify everything
        mode: context.getMode(),

        // inform webpack we are building for nodejs, not browsers
        target: 'node',

        // we specify the root file to allow webpack to
        // calculate the dependency tree and strip away unused stuff
        entry: `${srcFolder}/index.js`,

        // where to put the output bundle
        output: {
            filename: 'index.js',
            path: dstFolder,
            libraryTarget: 'commonjs2',
        },

        resolve: {
            // disable "symlink resolution", in order to make it work as expected
            symlinks: false,
        },

        plugins: [
            // the plugin tells webpack not to bundle-up node_modules, but in practise it sometimes
            // breaks everything :(
            new ExternalsPlugin({
                type: 'commonjs',
                include: path.join(context.getTaskFolder(), 'node_modules'),
            }),
            // a cache, for incremental builds
            new HardSourceWebpackPlugin({
                cacheDirectory: `${context.getHardSourcePluginFolder()}`,
                cachePrune: {
                    // wipe out cache older than 1 day
                    maxAge: 24 * 60 * 60 * 1000,
                    // wipe out cache higher than 50mb
                    sizeThreshold: 50 * 1024 * 1024
                },
                info: {
                    // 'debug', 'log', 'info', 'warn', or 'error'.
                    level: 'info',
                },
            }),
            new webpack.ProvidePlugin({
                _: `${srcFolder}/shared/lib/global/lodash.js`,
                mix: `${srcFolder}/shared/lib/global/mix.js`,
            }),
        ],
    };
};

module.exports = getWebpackConfiguration;
module.exports.getSrcFolder = getSrcFolder;
module.exports.getParameters = getParameters;
