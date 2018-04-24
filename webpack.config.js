'use strict';

const webpack = require('webpack');
// const fs = require('fs');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    // mode: 'development',

    entry: {
        main: ['./src/index.js'],
        simulator: ['./src/simulators.js']
    },

    output: {
        path: path.resolve(__dirname, 'public'),
        filename: '[name].bundle.js'
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
                test: /\.tjson$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name].json',
                            publicPath: '',
                            useRelativePath: true
                        }
                    }
                ]
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
            filename: 'index.html',
            title: 'Home Monitoring Application',
            hash: true,
            chunks: ['main'],
            template: 'src/index.ejs'
        }),
        new HtmlWebpackPlugin({
            filename: 'simulators.html',
            title: 'Home Monitoring Application - Simulator',
            hash: true,
            chunks: ['simulator'],
            template: 'src/simulators.ejs'
        })
    ],

    devServer: {
        contentBase: path.join(__dirname, 'public'),
        compress: true,
        port: 5000,
        // hot: true,
        // inline: true,
        host: '0.0.0.0'
    }
};
