/* eslint-disable */

const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require('webpack');

/**
 *
 * @param context
 * @returns {string}
 */
const getSrcFolder = (context) => {
	return `${context.getProjectFolder()}/app.front.client/`;
};

/**
 *
 * @returns {{analyzeBundle: boolean}}
 */
const getParameters = () => {
	return {
		analyzeBundle: true,
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

	console.dir('Src folder: '+srcFolder);
	console.dir('Dst folder: '+dstFolder);

  return {
    // in the production mode webpack will minify everything
    mode: context.getMode(),

    // we specify the root file to allow webpack to
    // calculate the dependency tree and strip away unused stuff
    entry: `${srcFolder}/index.js`,

    // where to put the output bundle
    output: {
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
    devtool: 'source-map',
    plugins: [
      // remove unused momentjs locales
      new webpack.ContextReplacementPlugin(
        /moment[\/\\]locale$/,
        /en/
      ),
      // a cache, for incremental builds
      new HardSourceWebpackPlugin({
        cacheDirectory: `${context.getHardSourcePluginFolder()}`,
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
      }),
      new HtmlWebpackPlugin({
        inject: false,
        hash: true,
        template: `${srcFolder}/assets.html`,
        filename: 'assets.html'
      }),
      new webpack.ProvidePlugin({
        // mix: `${srcFolder}/common/lib/util/global/mix.js`,
      }),
    ],
  };
};

module.exports = getWebpackConfiguration;
module.exports.getSrcFolder = getSrcFolder;
module.exports.getParameters = getParameters;
