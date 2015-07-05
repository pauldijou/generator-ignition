'use strict';

module.exports = core.base.extend({
  initializing: function () {
    this.log('ROUTE');
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
