'use strict';
var _ = require('lodash');
var Base = require('../app/base');

module.exports = Base.extend({
  prompting: function () {
    var done = this.async();
    var generators = this.getGenerators();

    var prompts = [{
      type: 'input',
      name: 'name',
      message: 'What\'s the name of your new sub-generator?',
      validate: function (answer) {
        if (!answer) {
          return 'You need to specify a valid name.';
        } else if (generators.indexOf(answer) > -1) {
          return 'A generator with this name already exists.';
        } else {
          return true;
        }
      }
    }];

    this.prompt(prompts, function (props) {
      this.props = props;
      done();
    }.bind(this));
  },

  writing: function {
    var name = _.kebabCase(this.props.name);
    var files = ['index.js', 'versions.js'];

    files.map(function (file) {
      return {from: file, to: 'generators/'+props.name+'/'+file};
    }).forEach(function (file) {
      this.fs.copy(this.templatePath(file.from), this.destinationPath(file.to));
    });
  }
});
