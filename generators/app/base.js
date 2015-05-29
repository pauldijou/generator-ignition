'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var _ = require('lodash');
var fs = require('fs');
var util = require('util');
var path = require('path');
var ejs = require('ejs');

var root = path.join(__dirname, '../../');
var dest = process.cwd();
var config = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), {encoding: 'utf8'}));
var name = config.name;
var repository = config.repository;
var debugFile = '.' + name + '-debug.json';

process.on('uncaughtException', function(e) {
  var prefix = '[' + chalk.red('ERROR') + '] ';
  var context = require('./context') || {};
  context.generator = {
    version: config.version
  };

  try {
    context.structure = context.structure && context.structure.toPOJO() || {};
  } catch (err) {
    context.structure = 'Failed to convert structure to POJO.';
  }

  context.stack = (e.stack || e.toString() || '').split('\n');
  context.process = {
    argv: process.argv.slice(2),
    execArgv: process.execArgv,
    version: process.version,
    arch: process.arch,
    platform: process.platform,
    uptime: process.uptime()
  };

  var error;
  try {
    fs.writeFileSync(debugFile, context.toString(), {encoding: 'utf8'});
  } catch (err) {
    error = err;
  }

  if (error) {
    console.log('---------------------------------------------------------');
    console.log(context.toString());
    console.log('---------------------------------------------------------');
  }

  console.log('');
  console.log(prefix + 'We are very sorry but it looks like ' + chalk.bold('the generator just crashed') + '.');
  console.log(prefix + 'If some files have been generated, chances are that they will not be working anyway.');
  console.log(prefix + 'Please, ' + chalk.bold('open an issue') + ' on our GitHub repository ( ' + repository + '/issues/new )');
  if (error) {
    console.log(prefix + 'We couldn\'t save the debug output to ' + chalk.bold.red(debugFile) + ' so we displayed it just before this error message.');
    console.log(prefix + 'Please copy/past it in the GitHub issue.')
  } else {
    console.log(prefix + 'Copy/paste the content of the ' + chalk.bold.red(debugFile) + ' file in it.');
  }
  console.log(prefix + 'We will fix it as quickly as possible and let you know what went wrong.')
  console.log('');
  console.log('');

  if (process.argv.indexOf('--debug') > -1) {
    console.log(e.stack);
  }

  process.exit();
});

var rootRegExp = new RegExp(root, 'g');
var destRegExp = new RegExp(dest, 'g');
var sanitizeMsg = function (msg) {
  return msg.replace(rootRegExp, '').replace(destRegExp, '');
}

var Base = module.exports = yeoman.generators.Base.extend({
  version: config.version,
  render: ejs.render,

  clean: function () {
    try {
      fs.unlink(debugFile);
    } catch (e) {
      // The file probably don't exist so we don't care
    }
  },

  verbose: function (msg) {
    if (this.context && this.context.options.verbose) {
      this.log(sanitizeMsg(msg));
    }
  },

  debug: function (msg) {
    if (this.context && this.context.options.debug) {
      this.log('[' + chalk.magenta.bold('DEBUG') + '] ' + sanitizeMsg(msg));
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

    and: function () {
      var args = Array.prototype.slice.call(arguments);
      return function (answers) {
        return args.reduce(function (res, f) {
          return res && f(answers);
        }, true);
      }
    },

    or: function () {
      var args = Array.prototype.slice.call(arguments);
      return function (answers) {
        return args.reduce(function (res, f) {
          return res || f(answers);
        }, true);
      }
    }
  },

  _msg: function (title, msg, color) { this.log('[' + chalk[color].bold(title) + '] ' + msg); },
  info: function (msg) { this._msg('INFO', msg, 'cyan') },
  success: function (msg) { this._msg('SUCCESS', msg, 'green') },
  warn: function (msg) { this._msg('WARN', msg, 'yellow') },
  error: function (msg) { this._msg('ERROR', msg, 'red') }
});
