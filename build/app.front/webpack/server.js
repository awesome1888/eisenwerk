/* eslint-disable */

const path = require('path');
const ExternalsPlugin = require('webpack2-externals-plugin');
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

// making MiniCssExtractPlugin functional server-side
class ServerMiniCssExtractPlugin extends MiniCssExtractPlugin {
    getCssChunkObject(mainChunk) {
        return {};
    }
}

/**
 *
 * @param context
 * @returns {string}
 */
const getSrcFolder = context => {
    return `${context.getProjectFolder()}/app.front.server/`;
};

/**
 *
 * @returns {{analyzeBundle: boolean}}
 */
const getParameters = () => {
    return {
        copyPackageJson: true, // copy package.json to a target build folder, in order to access it with Dockerfile
        rebuildImage: false,
    };
};

/**
 *
 * @param context
 * @returns {Promise<{mode, target: string, entry: string, output: {filename: string, path: *, libraryTarget: string}, resolve: {symlinks: boolean}, plugins: *[]}>}
 */
const getWebpackConfiguration = async context => {
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
            publicPath: '/',
        },

        resolve: {
            extensions: ['.js', '.jsx'],
            // disable "symlink resolution", in order to make it work as expected
            symlinks: false,
        },

        module: {
            rules: [
                {
                    test: /\.jsx?$/,
                    exclude: /node_modules(\/|\\)(?!(@feathersjs))/,
                    use: [
                        {
                            loader: 'babel-loader',
                            options: {
                                cacheDirectory: true,
                                plugins: [
                                    // Stage 0
                                    '@babel/plugin-proposal-function-bind',

                                    // Stage 1
                                    '@babel/plugin-proposal-export-default-from',
                                    '@babel/plugin-proposal-logical-assignment-operators',
                                    [
                                        '@babel/plugin-proposal-optional-chaining',
                                        { loose: false },
                                    ],
                                    [
                                        '@babel/plugin-proposal-pipeline-operator',
                                        { proposal: 'minimal' },
                                    ],
                                    [
                                        '@babel/plugin-proposal-nullish-coalescing-operator',
                                        { loose: false },
                                    ],
                                    '@babel/plugin-proposal-do-expressions',

                                    // Stage 2
                                    [
                                        '@babel/plugin-proposal-decorators',
                                        { legacy: true },
                                    ],
                                    '@babel/plugin-proposal-function-sent',
                                    '@babel/plugin-proposal-export-namespace-from',
                                    '@babel/plugin-proposal-numeric-separator',
                                    '@babel/plugin-proposal-throw-expressions',

                                    // Stage 3
                                    '@babel/plugin-syntax-dynamic-import',
                                    '@babel/plugin-syntax-import-meta',
                                    [
                                        '@babel/plugin-proposal-class-properties',
                                        { loose: false },
                                    ],
                                    '@babel/plugin-proposal-json-strings',
                                ],
                                presets: [
                                    '@babel/react', // translate jsx
                                    [
                                        '@babel/env',
                                        {
                                            targets: {
                                                browsers: ['last 2 versions'],
                                            },
                                        },
                                    ],
                                ],
                            },
                        },
                    ],
                },
                {
                    test: /\.(sa|sc|c)ss$/,
                    exclude: /node_modules/,
                    use: [
                        // 'style-loader',
                        ServerMiniCssExtractPlugin.loader,
                        {
                            loader: 'css-loader',
                            options: {
                                sourceMap: true,
                            },
                        },
                        {
                            loader: 'sass-loader',
                            options: {
                                sourceMap: true,
                            },
                        },
                    ],
                },
                {
                    test: /\.less$/,
                    exclude: /node_modules/,
                    use: [
                        // 'style-loader',
                        ServerMiniCssExtractPlugin.loader,
                        {
                            loader: 'css-loader',
                            options: {
                                sourceMap: true,
                            },
                        },
                        {
                            loader: 'less-loader',
                            options: {
                                sourceMap: true,
                            },
                        },
                    ],
                },
                {
                    test: /\.(jpe?g|gif|png|svg|ico)$/i,
                    use: [
                        {
                            loader: 'url-loader',
                            options: {
                                limit: 10000,
                            },
                        },
                    ],
                },
            ],
        },

        plugins: [
            // the plugin tells webpack not to bundle-up node_modules, but in practise it sometimes
            // breaks everything :(
            new ExternalsPlugin({
                type: 'commonjs',
                include: path.join(context.getTaskFolder(), 'node_modules'),
            }),
            // // a cache, for incremental builds
            // new HardSourceWebpackPlugin({
            //     cacheDirectory: `${context.getHardSourcePluginFolder()}`,
            //     cachePrune: {
            //         // wipe out cache older than 1 day
            //         maxAge: 24 * 60 * 60 * 1000,
            //         // wipe out cache higher than 50mb
            //         sizeThreshold: 50 * 1024 * 1024
            //     },
            //     info: {
            //         // 'debug', 'log', 'info', 'warn', or 'error'.
            //         level: 'info',
            //     },
            // }),
            new ServerMiniCssExtractPlugin({
                filename: 'style.css',
            }),
            new webpack.ProvidePlugin({
                _: `${srcFolder}/shared/lib/global/lodash.js`,
                mix: `${srcFolder}/shared/lib/global/mix.js`,
            }),
            new webpack.DefinePlugin({
                __DEV__: true, // context.getMode() === 'development',
                __SSR__: true,
            }),
        ],
    };
};

module.exports = getWebpackConfiguration;
module.exports.getSrcFolder = getSrcFolder;
module.exports.getParameters = getParameters;
