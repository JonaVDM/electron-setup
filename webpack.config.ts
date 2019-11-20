import * as path from 'path';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import OptimizeCSSAssetsPlugin from 'optimize-css-assets-webpack-plugin';
import UglifyJsPlugin from 'uglifyjs-webpack-plugin';
const CssUrlRelativePlugin = require('css-url-relative-plugin');

import { VueLoaderPlugin } from 'vue-loader';
import WebpackNotifierPlugin from 'webpack-build-notifier';
import FriendlyErrorsWebpackPlugin from 'friendly-errors-webpack-plugin';
import webpack from 'webpack';

export default <webpack.Configuration >{
    entry: './src/frontend/main.js',
    output: {
        filename: 'js/script.min.js',
        path: path.resolve(__dirname, 'dist')
    },
    module: {
        rules: [{
            test: /\.vue$/,
            loader: 'vue-loader',
        },
        {
            test: /\.(png|jpg|gif|jpeg)$/,
            use: [{
                loader: 'file-loader',
                options: {
                    outputPath: 'img'
                }
            }]
        },
        {
            test: /\.(sass|scss|css)$/,
            use: [
                MiniCssExtractPlugin.loader,
                'css-loader',
                'sass-loader',
            ]
        },
        {
            test: /\.m?js$/,
            exclude: /(node_modules|bower_components)/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/preset-env'],
                    plugins: ["@babel/plugin-syntax-dynamic-import"]
                }
            }
        },
        {
            test: /\.(woff|woff2|eot|svg)$/,
            use: {
                loader: 'file-loader',
            },
        },
        {
            test: /\.(tff)$/,
            use: {
                loader: 'url-loader'
            }
        }
        ]
    },
    resolve: {
        alias: {
            'vue$': 'vue/dist/vue.esm.js',
            '@': path.resolve(__dirname, 'src/frontend')
        },
        extensions: ['*', '.js', '.vue', '.json', '.png', '.jpg']
    },
    plugins: [
        new VueLoaderPlugin(),
        new WebpackNotifierPlugin({
            title: 'compiler',
            sound: false
        }),
        new FriendlyErrorsWebpackPlugin({
            clearConsole: true
        }),
        new MiniCssExtractPlugin({
            filename: 'css/style.min.css'
        }),
        new CssUrlRelativePlugin()
    ],
    optimization: {
        minimizer: [
            new OptimizeCSSAssetsPlugin({}),
            new UglifyJsPlugin()
        ]
    },
    performance: {
        hints: false,
    },
    mode: "production"
};
