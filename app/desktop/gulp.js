const path = require('path');
const os = require('os');
const ExternalsPlugin = require('webpack2-externals-plugin');
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// const WebpackMd5Hash = require('webpack-md5-hash');
const webpack = require('webpack');
// const hash = require('node-object-hash');

const Application = require('../../build-tool/lib/application.js');

module.exports = class extends Application {
    getTaskSchema() {
        const rootFolder = this.getRootFolder();
        return [
            {
                code: 'server',
                watch: [`${rootFolder}/server/src/**/*`],
                build: this.buildServer.bind(this),
                folder: `${rootFolder}/server/`,
            },
            {
                code: 'client',
                watch: [`${rootFolder}/client/src/**/*`],
                build: this.buildClient.bind(this),
                folder: `${rootFolder}/client/`,
                debugBundle: true,
            },
        ];
    }

    async buildClient(task) {
        const rootFolder = this.getRootFolder();
        const subFolder = `${rootFolder}/client`;
        const srcFolder = `${subFolder}/src/`;
        const dstFolder = `${subFolder}/build/`;
        const tmpDir = os.tmpdir();

        return new Promise((resolve, reject) => {
            webpack({
                // in the production mode webpack will minify everything
                mode: 'development',
                // mode: 'production',

                // we specify the root file to allow webpack to
                // calculate the dependency tree and strip away unused stuff
                entry: `${srcFolder}/index.js`,

                // where to put the output bundle
                output: {
                    // filename: '[name].[chunkhash].js',
                    filename: '[name].js',
                    path: dstFolder,
                    publicPath: 'public/',
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
                                        plugins: [
                                            'transform-class-properties'
                                        ],
                                        presets: [
                                            'es2015',
                                            'react', // translate jsx
                                            'stage-0', // async code
                                            'stage-2', // spread operator
                                            ['env', {
                                                targets: {
                                                    browsers: ['last 2 versions'],
                                                }
                                            }]
                                        ]
                                    }
                                }
                            ]
                        },
                        {
                            test: /\.(sa|sc|c)ss$/,
                            exclude: /node_modules/,
                            use: [
                                'style-loader',
                                MiniCssExtractPlugin.loader,
                                {
                                    loader: 'css-loader',
                                    options: {
                                        sourceMap: true
                                    }
                                },
                                // 'postcss-loader',
                                // https://github.com/webpack-contrib/sass-loader
                                {
                                    loader: 'sass-loader',
                                    options: {
                                        sourceMap: true
                                    }
                                }
                            ],
                        },
                        {
                            test: /\.less$/,
                            exclude: /node_modules/,
                            use: [
                                'style-loader',
                                MiniCssExtractPlugin.loader,
                                {
                                    loader: 'css-loader',
                                    options: {
                                        sourceMap: true
                                    }
                                },
                                // 'postcss-loader',
                                {
                                    loader: 'less-loader',
                                    options: {
                                        sourceMap: true
                                    }
                                }
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
                    ]
                },

                // https://webpack.js.org/configuration/devtool/
                // devtool: 'inline-source-map',
                devtool: 'source-map',
                plugins: [
                    // remove unused momentjs locales
                    new webpack.ContextReplacementPlugin(
                        /moment[\/\\]locale$/,
                        /en/
                    ),
                    // new webpack.DefinePlugin({
                    //     'process.env.NODE_ENV': '"production"'
                    // }),
                    // a cache, for incremental builds
                    new HardSourceWebpackPlugin({
                        cacheDirectory: `${tmpDir}/build-tool-cache/${this.getAppCode()}:${task.code}/[confighash]`,
                        cachePrune: {
                            // wipe out cache older than 1 minute
                            maxAge: 60 * 1000,
                            // wipe out cache higher than 50mb
                            sizeThreshold: 50 * 1024 * 1024
                        },
                        info: {
                            // 'debug', 'log', 'info', 'warn', or 'error'.
                            level: 'info',
                        },
                    }),
                    new MiniCssExtractPlugin({
                        filename: 'style.css',
                        // filename: 'style.[contenthash].css',
                        // chunkFilename: '[id].css'// devMode ? '[id].css' : '[id].[hash].css',
                    }),
                    new HtmlWebpackPlugin({
                        inject: false,
                        hash: true,
                        template: `${srcFolder}/assets.html`,
                        filename: 'assets.html'
                    }),
                    new webpack.ProvidePlugin({
                        _: 'underscore-mixin',
                        $: 'jquery',
                        mern: `${srcFolder}/common/lib/util/global/mern.js`,
                        mix: `${srcFolder}/common/lib/util/global/mix.js`,
                        t: `${srcFolder}/common/lib/util/global/t.js`,
                        l: `${srcFolder}/common/lib/util/global/l/client.js`,
                    }),
                ],
            }, (err, stats) => {
                this.logWebpackComplex(err, stats, resolve, reject, task);
            });
        });
    }

    async buildServer(task) {
        const rootFolder = this.getRootFolder();
        const subFolder = `${rootFolder}/server`;
        const srcFolder = `${subFolder}/src/`;
        const dstFolder = `${subFolder}/build/`;
        const tmpDir = os.tmpdir();

        return new Promise((resolve, reject) => {
            webpack({
                // in the production mode webpack will minify everything
                mode: 'development',
                // mode: 'production',

                // inform webpack we are building for nodejs, not browsers
                target: 'node',
                node: {
                    __dirname: true
                },

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
                        include: path.join(`${rootFolder}/server/`, 'node_modules'),
                    }),
                    // a cache, for incremental builds
                    new HardSourceWebpackPlugin({
                        cacheDirectory: `${tmpDir}/build-tool-cache/${this.getAppCode()}:${task.code}/[confighash]`,
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
                        _: 'underscore-mixin',
                        mern: `${srcFolder}/common/lib/util/global/mern.js`,
                        mix: `${srcFolder}/common/lib/util/global/mix.js`,
                        t: `${srcFolder}/common/lib/util/global/t.js`,
                        l: `${srcFolder}/common/lib/util/global/l/server.js`,
                    }),
                ],
            }, (err, stats) => {
                this.logWebpackComplex(err, stats, resolve, reject, task);
            });
        });
    }
};
