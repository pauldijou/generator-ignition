'use strict';
var _ = require('lodash');
var core = require('../../core/core.js');

module.exports = core.base.extend({
  prompting: function () {
    var done = this.async();
    var generators = this.getSubGenerators();

    var prompts = [{
      type: 'input',
      name: 'name',
      message: 'What\'s the name of your new subgenerator?',
      validate: function (answer) {
        if (!answer) {
          return 'You need to specify a valid name.';
        } else if (generators.indexOf(answer) > -1) {
          return 'A generator with this name already exists.';
        } else {
          return true;
        }
      }
    }, {
      type: 'choice',
      name: 'snippet',
      message: 'Are you planning to have snippets?',
      choices: [
        {name: 'Yes', value: true},
        {name: 'No', value: false}
      ]
    }];

    this.prompt(prompts, function (props) {
      this.props = props;
      done();
    }.bind(this));
  },

  writing: function () {
    var name = _.kebabCase(this.props.name);
    var files = ['index.js', 'versions.js', 'templates'];

    files.map(function (file) {
      return {from: this.templatePath(file), to: this.destinationPath((this.props.snippet ? 'app/' : '') + file)};
    }.bind(this)).forEach(function (file) {
      this.fs.copy(file.from, file.to);
    }.bind(this));
  }
});
