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

    // Improve structure if necessary
    // strucutre.addFolder('name');

    // Add packages
    // packages.push(core.packages.myPackage);

    // Add dependencies and files
    // structure.name.add(this, 'file.js');
    // if (has.feature) { npm.push('my-package'); }

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
