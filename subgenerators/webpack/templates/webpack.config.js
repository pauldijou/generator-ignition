var webpack = require('webpack');
var path = require('path');

module.exports = {
  debug: true,
  devtool: '#eval-source-map',
  context: path.join(__dirname, 'scripts'),

  entry: [
    'webpack/hot/dev-server',
    'webpack-hot-middleware/client',
    './app'
  ],

  output: {
    path: path.join(__dirname, 'build', 'scripts'),
    publicPath: '/js/',
    filename: 'app.js'
  },

  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ],

  module: {
    loaders: [
      { test: /\.jsx?$/, exclude: /node_modules/, loaders: ['react-hot', 'babel'] }
    ]
  }
};
