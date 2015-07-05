'use strict';
var Base = require('../app/base')

module.exports = Base.extend({
  initializing: function () {
    this.init();
  },

  configuring: function () {
    var props = this.context.props;
    var has = this.context.has;
    var npm = [];
    var npmDev = [];
    var bower = [];

    // Improve this.structure if necessary

    // Add dependencies and files

    this.context.add({
      versions: require('./versions'),
      npm: npm,
      npmDev: npmDev,
      bower: bower
    });
  },

  end: function () {
    this.finish();
  }
});
