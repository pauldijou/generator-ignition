'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var _ = require('lodash');

module.exports = yeoman.generators.Base.extend({
  delimiter: function () {
    this.log('');
    this.log('-----------------------------------');
    this.log('');
  },

  prompts: {
    has: function (property) {
      return function (answers) {
        return !!answers[property];
      };
    },

    is: function (property, value) {
      return function (answers) {
        return answers[property] === value;
      };
    },

    compose: function () {
      var args = Array.prototype.slice.call(arguments);
      return function (answers) {
        var result = true;
        args.forEach(function (arg) {
          result = result && arg(answers);
        })
        return result;
      }
    }
  }

  msg: {
    raw: function (title, msg, color) {
      this.log('[' + chalk[color].bold(title) + '] ' + msg);
    },
    info: function (msg) { this.raw('INFO', msg, 'cyan'); },
    success: function (msg) { this.raw('SUCCESS', msg, 'green'); },
    warn: function (msg) { this.raw('WARN', msg, 'yellow'); },
    error: function (msg) { this.raw('ERROR', msg, 'red'); }
  }
});
