#!/usr/bin/env node

'use strict';

var chalk = require('chalk');
var omelette = require('omelette');
var _ = require('lodash');
var cp = require('child_process');
var utils = require('../core/utils.js');

// Possible commands
var commands = utils.getGenerators().filter(function (c) {
  return c !== 'app' && c !== 'sub';
}).concat(utils.getSnippets());

// Enable completion
var complete = omelette('ignition <command>');

complete.on('command', function () {
  // TODO: improve by filtering snippets depending of user answers
  this.reply(commands);
});

complete.init();

if (process.argv.length === 4 && process.argv[2] === 'completion' && process.argv[3] === 'install') {
  complete.setupShellInitFile();
  console.log('Completion installed for ' + chalk.cyan('ignition') + ' command. Open a new shell to see it in action.');
  return true;
}

// Parse and manage help for the CLI
var argv = require('yargs')
  .usage('\nUsage: '+ chalk.cyan('ignition') +' [command]\n\nCompletion: '+ chalk.cyan('ignition') +' completion install')
  .version(function() {
    return require('../package.json').version;
  })
  .alias('V', 'version')
  .help('help')
  .alias('h', 'help')
  .showHelpOnFail(false, 'Specify --help for available options')
  .epilog('License Apache 2. Copyright 2015 Paul Dijou.')
  .argv;

if (argv.help) {
  console.log(argv.help());
} else {
  var command = argv._[0];

  // For now, a valid command is a subsubgenerator, aka a snippet
  if (command && commands.indexOf(command) < 0) {
    console.log('Error');
    return;
  }

  var args = [];

  if (command) {
    args.push('ignition:' + command);
    args = args.concat(process.argv.slice(3));
  } else {
    args.push('ignition');
    args = args.concat(process.argv.slice(2));
  }

  cp.spawnSync('yo', args, {stdio: 'inherit'});
}
