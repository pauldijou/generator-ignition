'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var _ = require('lodash');
var fs = require('graceful-fs');
var path = require('path');
var ejs = require('ejs');
var utils = require('./utils');

var root = utils.root;
var dest = process.cwd();
var config = require(path.resolve(root, 'package.json'));
var name = config.name;
var repository = config.repository.url;
var debugFile = '.' + name + '-debug.json';

var rootRegExp = new RegExp(root, 'g');
var destRegExp = new RegExp(dest, 'g');
var sanitizeMsg = function (msg) {
  return msg.replace(rootRegExp, '').replace(destRegExp, '');
}

module.exports = yeoman.generators.Base.extend({
  // Usefull stuff
  version: config.version,
  src: root,
  dest: dest,

  // Templating
  render: ejs.render,

  // Init both context and structure
  init: function () {
    if (!this.context) {
      this.context = this.options.context || require('./context');
    }

    if (!this.structure) {
      this.structure = this.context.structure;
    }
  },

  finish: function () {
    if (this.context.generator === this) {
      this.context.save();
    }
  },

  clean: function () {
    try {
      fs.unlinkSync(debugFile);
    } catch (e) {
      // The file probably doesn't exist so we don't care
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

  getGenerators: utils.getGenerators,
  getSubgenerators: utils.getSubgenerators,
  getSnippets: utils.getSnippets,

  composeLocal: function (gen, sub) {
    if (!gen || !_.isString(gen)) {
      throw new Error('You can only run a generator, which should be a string: [' + gen + ']');
    } else if (this.getSubgenerators().indexOf(gen) < 0) {
      throw new Error('[' + gen + '] is not a valid generator');
    }


    if (sub && !_.isString(sub)) {
      throw new Error('If you specify a subgenerator, it must be a string: [' + sub + ']');
    } else if (sub && this.getSnippets().indexOf(gen + ':' + sub) < 0) {
      throw new Error('[' + sub + '] is not a valid subgenerator');
    }

    if (!sub) {
      sub = 'app';
    }

    var name = gen;
    var local = path.resolve(root, 'subgenerators', gen);

    try {
      var subLocal = path.resolve(local, sub);
      fs.statSync(subLocal);
      name += ':' + sub;
      local = subLocal;
    } catch (e) {}

    this.composeWith(name, {}, {local: local});
  },

  snippet: function (gen, sub) {
    if (!gen || !sub) {
      throw new Error('You can only execute a subgenerator (ex: angular2:route)');
    } else {
      this.composeLocal(gen, sub);
    }
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

    not: function (fun) {
      return function (answers) {
        return !fun(answers);
      };
    },

    and: function () {
      var args = Array.prototype.slice.call(arguments);
      return function (answers) {
        return args.reduce(function (res, f) {
          return res && f(answers);
        }, true);
      };
    },

    or: function () {
      var args = Array.prototype.slice.call(arguments);
      return function (answers) {
        return args.reduce(function (res, f) {
          return res || f(answers);
        }, true);
      };
    }
  },

  _msg: function (title, msg, color) { this.log('[' + chalk[color].bold(title) + '] ' + msg); },
  info: function (msg) { this._msg('INFO', msg, 'cyan') },
  success: function (msg) { this._msg('SUCCESS', msg, 'green') },
  warn: function (msg) { this._msg('WARN', msg, 'yellow') },
  error: function (msg) { this._msg('ERROR', msg, 'red') }
});

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
