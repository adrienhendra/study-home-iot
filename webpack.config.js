'use strict';

const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: 'development',

    entry: ['webpack-dev-server/client?http://localhost:5000', 'webpack/hot/only-dev-server', './src/index.js'],

    output: {
        path: path.resolve(__dirname, 'public'),
        filename: 'bundle.js'
    },

    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.html$/,
                use: 'html-loader'
            },
            {
                test: /\.(png|jp(e*)g|svg|gif)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name].[ext]',
                            publicPath: '',
                            useRelativePath: true
                        }
                    }
                ]
            },
            {
                test: /\.(wav|mp3)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name].[ext]',
                            publicPath: '',
                            useRelativePath: true
                        }
                    }
                ]
            }
        ]
    },

    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new HtmlWebpackPlugin({
            title: 'IoT Demo',
            hash: true,
            template: 'src/index.html'
        })
    ],

    devServer: {
        contentBase: path.join(__dirname, 'public'),
        compress: true,
        port: 5000,
        hot: true,
        inline: true,
        host: '0.0.0.0'
    }
};
