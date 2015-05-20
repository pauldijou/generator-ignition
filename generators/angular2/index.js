'use strict';
var Base = require('../app/base');

module.exports = Base.extend({
  initializing: function () {
    this.context = this.options.context;
    this.structure = this.context.structure;
  },

  prompting: function () {
    var done = this.async();

    var prompts = [{
      type: 'input',
      name: 'toto',
      message: 'angular2 question here'
    }];

    this.prompt(prompts, function (props) {
      this.props = props;
      done();
    }.bind(this));
  }
});
