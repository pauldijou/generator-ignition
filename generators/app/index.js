'use strict';
var chalk = require('chalk');
var yosay = require('yosay');
var versions = require('./versions');

global.core = require('../../core/core.js');
global.context = core.context;

module.exports = core.base.extend({
  initializing: {
    clean: function () {
      this.clean();
    },

    options: function () {
      this.option('debug');
      this.option('verbose');
    },

    context: function () {
      context.generator = this;
      context.structure = new core.structure.Folder(this.appname);
      context.options = {
        debug: this.options.debug,
        verbose: this.options.verbose
      };
    }
  },

  prompting: function () {
    var done = this.async();

    this.log(yosay(
      '3... 2... 1... ' + chalk.red('Ignition')
    ));

    var prompts = require('./prompts')(this);

    this.prompt(prompts, function (props) {
      this.props = props;
      done();
    }.bind(this));
  },

  configuring: function () {
    var props = this.props;
    var has = {};
    var npm = [];
    var npmDev = [];
    var bower = [];

    context.structure.add(this, 'gitignore', '.gitignore');
    context.structure.add(this, 'index.html');

    if (props.build) {
      has.build = true;
      has[props.build] = true;
      context.structure.addFolder('build');
      context.structure.addFolder('dist');
    }

    if (props.style) {
      has.style = true;
      has[props.style] = true;
      context.structure.addFolder('styles');
    }

    if (props.script) {
      has.script = true;
      has[props.script] = true;
      context.structure.addFolder('scripts');
    }

    if (props.loader) {
      has.loader = true;
      has[props.loader] = true;
    }

    if (props.images) {
      has.images = true;
      context.structure.addFolder('images');

      if (props.icons) {
        has.icons = true;
        context.structure.images.addFolder('icons');
      }
    }

    if (props.server) {
      has.server = true;
      if (props.server !== true) {
        has[props.server] = true;
      }
    }

    props.buildOthers.forEach(function (o) {
      has[o] = true;
    });

    if (props.test) {
      has.test = true;
      context.structure.addFolder('test');
      context.structure.test.addFolder('unit');
      context.structure.test.addFolder('e2e');
    }

    switch (props.style) {
      case 'sass':
      context.structure.styles.add(this, 'app.scss');
        break;
      case 'less':
      context.structure.styles.add(this, 'app.less');
        break;
      case 'stylus':
      context.structure.styles.add(this, 'app.styl');
        break;
      case 'css':
      context.structure.styles.add(this, 'app.css');
        break;
    }

    switch (props.script) {
      case 'babel':
      context.structure.scripts.add(this, 'app.es6', 'app.js');
        break;
      case 'traceur':
      context.structure.scripts.add(this, 'app.es6', 'app.js');
        break;
      case 'coffeescript':
      context.structure.scripts.add(this, 'app.coffee');
        break;
      case 'typescript':
      context.structure.scripts.add(this, 'app.ts');
        break;
      case 'javascript':
      context.structure.scripts.add(this, 'app.js');
        break;
    }

    if (props.csslint) {
      has.csslint = true;
      context.structure.add(this, 'csslintrc', '.csslintrc');
    }

    if (props.jslint) {
      has.jshint = true;

      if (has.coffeescript) {
        context.structure.add(this, 'coffeelint.ejs', 'coffeelint.json');
      } else if (has.typescript) {
        context.structure.add(this, 'tslint.ejs', 'tslint.json');
      } else {
        context.structure.add(this, 'eslintrc', '.eslintrc');
      }
    }

    if (props.framework) {
      has.framework = true;
      has[props.framework] = true;
    }

    props.libs.forEach(function (l) {
      has[l] = true;
    });

    // Test for libs which needs a 'vendors' folder
    if (has.modernizr) {
      has.vendors = true;
      context.structure.add('vendors');
    }

    if (has.modernizr) {
      this.info('You should use your own custom version of Modernizr depending on your requirements. We will put a "default" one just so the project can build but you should replace it as soon as possible with one downloaded from http://modernizr.com/download/ .');
      context.structure.vendors.add(this, 'modernizr.js');
    }

    context.add({
      props: props,
      versions: versions,
      has: has,
      npm: npm,
      npmDev: npmDev,
      bower: bower
    });
  },

  composition: function () {
    this.delimiter();
    this.getSubgenerators().forEach(function (gen) {
      if (context.has[gen]) {
        this.log('Beginning the setup of ' + chalk.red(gen) + '...');
        this.composeLocal(gen);
        this.log('Setup done.');
        this.delimiter();
      }
    }.bind(this));
  },

  packaging: function () {
    // We need to install all packages now
    // They might add new NPM or Bower dependencies
    context.install();

    // If we don't have any dependencies, it probably means we don't really
    // need such files
    if (context.npm.length > 0 || context.npmDev.length > 0) {
      context.structure.add(this, 'package.ejs', 'package.json');
    }

    if (context.bower.length > 0 || context.bowerDev.length > 0) {
      context.structure.add(this, 'bower.ejs', 'bower.json');
    }
  },

  structuring: function () {
    var self = this;
    var done = this.async();
    this.log('Here is the structure of the application I\'m about to create for you:');
    this.log('');
    this.log(context.structure.toTree());
    this.log('');
    this.log('');

    this.prompt([{
      name: 'renaming',
      type: 'list',
      message: 'Are you okay with it or do you want to rename some folders?',
      default: true,
      choices: [
        {name: 'LGTM (Looks good to me)', value: false},
        {name: 'Not okay', value: true}
      ]
    }], function (props) {
      if (props.renaming) {
        renameFolder();
      } else {
        done();
      }
    }.bind(this));

    function renameFolder() {
      self.prompt([{
        name: 'folder',
        type: 'list',
        message: 'Please, pick a folder to rename',
        choices: self.structure.toTuples(true).map(function (t) {
          return {name: t.string, value: t.object};
        }).concat([
          {name: ' ', value: false},
          {name: 'I\'m done renaming.', value: false}
        ])
      }, {
        name: 'folderName',
        type: 'input',
        message: 'Enter the new name',
        when: function (answers) {
          return !!answers.folder;
        }
      }], function (props) {
        if (props.folder) {
          props.folder.rename(props.folderName);
          renameFolder();
        } else {
          done();
        }
      });
    }
  },

  writing: function () {
    this.delimiter();
    this.log('Thanks for all your answers! Time for me to work now.');
    this.log('');

    context.structure.forEachFile(function (file) {
      var from = file.getTemplatePath();
      var to = this.destinationPath(file.getDestinationPath());
      this.debug('Templating from ' + chalk.bold(from) + ' to ' + chalk.bold(to));
      this.fs.copyTpl(from, to, context);
    }.bind(this));
    this.debug(' ');
  },

  install: function () {
    if (context.structure.has('package.ejs')) {
      this.npmInstall('');
    }

    if (context.structure.has('bower.ejs')) {
      this.bowerInstall('');
    }
  },

  _displayMessages: function (property, color) {
    if (context[property].length > 0) {
      context[property].forEach(function (msg) {
        this.log('[' + chalk[color].bold(property.toUpperCase()) + '] ' + msg);
      }.bind(this));

      this.log('');
    }
  },

  end: function () {
    this._displayMessages('info', 'cyan');
    this._displayMessages('success', 'green');
    this._displayMessages('warn', 'yellow');
    this._displayMessages('error', 'red');
    this.log('');
    this.log('');
  }
});
