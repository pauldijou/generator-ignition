'use strict';

module.exports = core.base.extend({
  initializing: function () {
    this.init();
  },

  configuring: function () {
    var structure = context.structure;
    var props = context.props;
    var has = context.has;

    var packages = [];
    var npm = [];
    var npmDev = [];
    var bower = [];

    // Add packages
    // packages.push(core.packages.myPackage);

    // Add dependencies and files
    structure.add(this, 'webpack.config.js');

    npmDev.push('webpack');
    npmDev.push('webpack-dev-middleware');
    npmDev.push('webpack-hot-middleware');

    if (has.babel) {
      npmDev.push('babel-core');
      npmDev.push('babel-loader');
    }

    context.add({
      versions: require('./versions'),
      packages: packages,
      npm: npm,
      npmDev: npmDev,
      bower: bower
    });
  },

  end: function () {
    this.finish();
  }
});
