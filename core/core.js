var path = require('path');
var utils = require('./utils');

function resolve(file) {
  return path.resolve(utils.root, file);
}

module.exports = {
  resolve: resolve,
  require: function (file) {
    return require(resolve(file));
  },
  base: require('./base.js'),
  context: require('./context.js'),
  structure: require('./structure.js'),
  packages: require('./packages.js'),
  utils: utils
};
