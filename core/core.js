var path = require('path');

function resolve(file) {
  return path.resolve('.', file);
}

module.exports = {
  resolve: resolve,
  require: function (file) {
    return require(resolve(file));
  },
  base: require('./base.js'),
  context: require('./context.js'),
  structure: require('./structure.js')
};
