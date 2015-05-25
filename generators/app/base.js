'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var _ = require('lodash');
var fs = require('fs');
var path = require('path');
var ejs = require('ejs');

module.exports = yeoman.generators.Base.extend({
  render: ejs.render,

  verbose: function (msg) {
    if (this.context && this.context.options.verbose) {
      this.log(msg);
    }
  },

  debug: function (msg) {
    if (this.context && this.context.options.debug) {
      this.log('[' + chalk.magenta.bold('DEBUG') + '] ' + msg);
    }
  },

  getGenerators: function (opts) {
    return fs.readdirSync(path.join(__dirname, '..')).filter(function (f) {
      return f !== 'app' && f !== 'faq' && f !== 'help' && f !== 'sub';
    });
  },

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
  },

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
