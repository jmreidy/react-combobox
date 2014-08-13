var path = require('path');
var fs = require('fs');

module.exports = {
  output: {
    filename: '[name].js',
    chunkFilename: '[id].chunk.js',
    path: path.join(__dirname, 'examples', 'build'),
    publicPath: '../build/'
  },

  module: {
    loaders: [
      {test: /\.js$/, loader: 'jsx-loader'}
    ]
  }
};


