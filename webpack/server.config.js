/**
 * COMMON WEBPACK CONFIGURATION
 */
const path = require('path');
const webpack = require('webpack');
const dotenv = require('dotenv');
require('@babel/register');

const dotEnvFile =
  process.env.ENVIRONMENT_NAME === 'production'
    ? '.env'
    : `.env.${process.env.ENVIRONMENT_NAME || 'local'}`;
console.log({ dotEnvFile });
const env = dotenv.config({ path: dotEnvFile }).parsed;
const stringifyENVVariables = (prev, next) => ({
  ...prev,
  [`process.env.${next}`]: JSON.stringify(process.env[next]),
});
const envKeys = {
  ...Object.keys(process.env).reduce(stringifyENVVariables, {}),
  ...Object.keys(env).reduce(stringifyENVVariables, {}),
};

delete envKeys['process.env.ENVIRONMENT_NAME'];
delete envKeys['process.env.NODE_ENV'];

let curDecimal = -1;
module.exports = (options = {}) => ({
  mode: options.mode,
  entry: options.entry,
  optimization: options.optimization,
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.jsx?$/, // Transform all .js and .jsx files required somewhere with Babel
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: options.babelQuery,
        },
      },
      {
        test: /\.(eot|otf|ttf|woff|woff2)$/,
        use: 'file-loader',
      },
      {
        test: /\.svg$/,
        use: [
          {
            loader: 'svg-url-loader',
            options: {
              // Inline files smaller than 10 kB
              limit: 10 * 1024,
              noquotes: true,
            },
          },
        ],
      },
      {
        test: /\.(jpg|png|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              // Inline files smaller than 10 kB
              limit: 10 * 1024,
            },
          },
          {
            loader: 'image-webpack-loader',
            options: {
              mozjpeg: {
                enabled: false,
                // NOTE: mozjpeg is disabled as it causes errors in some Linux environments
                // Try enabling it in your environment by switching the config to:
                // enabled: true,
                // progressive: true,
              },
              gifsicle: {
                interlaced: false,
              },
              optipng: {
                optimizationLevel: 7,
              },
              pngquant: {
                quality: '65-90',
                speed: 4,
              },
            },
          },
        ],
      },
      {
        test: /\.html$/,
        use: 'html-loader',
      },
      {
        test: /\.(mp4|webm)$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 10000,
          },
        },
      },
    ],
  },
  plugins: options.plugins.concat([
    new webpack.ProgressPlugin((percentage, message, ...args) => {
      const percentDecimal = parseInt((percentage * 10).toString(), 10);
      if (percentDecimal !== curDecimal) {
        curDecimal = percentDecimal;
        console.info(
          parseFloat(String(percentage * 100)).toFixed(2),
          message,
          ...args
        );
      }
    }),
    new webpack.DefinePlugin(envKeys),
  ]),
  resolve: {
    modules: ['node_modules', 'app'],
    alias: {
      '@root': path.resolve(__dirname, '../'),
      '@utils': path.resolve(__dirname, '../utils'),
      '@config': path.resolve(__dirname, '../config'),
      '@plugins': path.resolve(__dirname, '../plugins'),
      '@services': path.resolve(__dirname, '../lib/services'),
      '@models': path.resolve(__dirname, '../lib/models'),
      '@daos': path.resolve(__dirname, '../lib/daos'),
      '@routes': path.resolve(__dirname, '../lib/routes'),
    },

    extensions: ['.js'],
  },
  output: {
    libraryTarget: 'commonjs',
  },
  target: 'node',
});
