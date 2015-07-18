'use strict';
var _ = require('lodash');
var fs = require('graceful-fs');
var path = require('path');
var core = require('../../core/core.js');
var utils = require('../../core/utils.js');

var templatesPath = path.resolve(__dirname, 'templates');

var faqs = fs.readdirSync(templatesPath).map(function (filename) {
  var res = utils.parseFileFrontMatter(path.resolve(templatesPath, filename));
  res.file = filename;
  return res;
});

var prompts = [{
  type: 'list',
  name: 'question',
  message: 'What do you want to know?',
  choices: faqs.map(function (f) {
    return {
      name: f.headers.question,
      value: f.file
    };
  }).concat([{name: 'I\'m done, get me out of here!', value: false}])
}];

function displayAnswer(filename) {
  faqs.forEach(function (f) {
    if (f.file === filename) {
      console.log('');
      console.log(f.headers.answer || f.content);
      console.log('');
    }
  });
}

module.exports = core.base.extend({
  prompting: function () {
    var self = this;
    var done = this.async();

    function ask() {
      self.prompt(prompts, function (props) {
        if (!props.question) {
          done();
        } else {
          displayAnswer(props.question);
          ask();
        }
      });
    }

    ask();
  }
});
