'use strict';

const webpack = require('webpack');
const path = require('path');

module.exports = {
  entry: './src/index.js',

  mode: 'none',

  output: {
    path: path.resolve(__dirname, 'public'),
    publicPath: '/public/',
    filename: 'project.bundle.js'
  },

  module: {
    rules: [
      {
        test: [/\.vert$/, /\.frag$/],
        use: 'raw-loader'
      }
    ]
  },

  plugins: [
    new webpack.DefinePlugin({
      CANVAS_RENDERER: JSON.stringify(true),
      WEBGL_RENDERER: JSON.stringify(true)
    })
  ],

  devServer:{
      contentBase: path.join(__dirname, 'public'),
      compress: true,
      port: 9000
  }
};
