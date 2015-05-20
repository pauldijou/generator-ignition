'use strict';
var chalk = require('chalk');
var yosay = require('yosay');
var versions = require('./versions');
var modules = require('./modules');
var Context = require('./context');
var Base = require('./base');
var structure = require('./structure');
var versions = require('./versions');

module.exports = Base.extend({
  initializing: {
    options: function () {
      this.option('debug');
      this.option('verbose');
    },

    structure: function () {
      this.structure = new structure.Folder(this.appname);
    },

    context: function () {
      this.context = new Context({
        structure: this.structure,
        options: {
          debug: this.options.debug,
          verbose: this.options.verbose
        }
      });
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

      this.props.buildOthers.forEach(function (o) {
        this.props[o] = true;
      });

      this.delimiter();

      done();
    }.bind(this));
  },

  configuring: function () {
    var props = this.pros;
    var npm = [];
    var npmDev = [];
    var bower = [];

    this.structure.add(this, 'gitignore', '.gitignore');
    this.structure.add(this, '_package.json', 'package.json');

    if (props.style) {
      this.structure.addFolder('styles');
    }

    if (props.script) {
      this.structure.addFolder('scripts');
    }

    if (props.test) {
      this.structure.addFolder('test');
      this.structure.test.addFolder('unit');
      this.structure.test.addFolder('e2e');
    }

    switch (props.style) {
      case 'sass':
        this.structure.style.add(this, 'app.scss');
        break;
      case 'less':
        this.structure.style.add(this, 'app.less');
        break;
      case 'stylus':
        this.structure.style.add(this, 'app.styl');
        break;
      case 'css':
        this.structure.style.add(this, 'app.css');
        break;
    }

    this.context.addGeneratorContext({
      props: props,
      versions: versions,
      npm: npm,
      npmDev: npmDev,
      bower: bower
    });
  },

  _composeWith: function (name) {
    this.log('Beginning the setup of ' + chalk.red(name) + '...');
    this.composeWith('kickoff:' + name, { options: { context: this.context } });
    this.log('');
    this.log('Setup done.');
    this.delimiter();
  },

  composition: function () {
    if (this.props.buildTool === 'gulp') {
      this._composeWith('gulp');
    }

    if (this.props.javaScriptFramework === 'angular2') {
      this._composeWith('angular2');
    }

    this.log('Thanks for all your answers! Time for me to work now.');
  },

  _getTemplateOf: function (file) {
    return file.generator.templatePath(file.getTemplatePath());
  },

  _getDestinationOf: function (file) {
    return this.destinationPath(this.engine(file.getDestinationPath(), this.context));
  },

  writing: function () {
    this.structure.forEachFile(function (file) {
      this.log(this._getTemplateOf(file));
      this.log(this._getDestinationOf(file));
      this.log(' ');
      this.template(
        this._getTemplateOf(file),
        this._getDestinationOf(file),
        this.context
      )
    }.bind(this));
  },

  _appendVersion: function (dependencies) {
    return dependencies.map(function (dep) {
      if (versions[dep]) {
        return dep + '@' + versions[dep];
      }
    });
  },

  install: {
    dependencies: function () {
      var dependencies = this._appendVersion(this._getDependencies())

      if (dependencies.length > 0) {
        // this.npmInstall(dependencies, { 'save': true })
      }
    },

    devDependencies: function () {
      var devDependencies = this._appendVersion(this._getDevDependencies())

      if (devDependencies.length > 0) {
        // this.npmInstall(devDependencies, { 'saveDev': true })
      }
    },

    all: function () {
      // this.installDependencies();
    }
  },

  _displayMessages: function (property, title, color) {
    if (this.context[property].length > 0) {
      this.log('--------------------------------------------------------------------');
      this.log('- ' + chalk[color].bold(title);
      this.log('------------------');
      this.log('');

      this.context[property].forEach(function (msg) {
        this.log(msg);
      }.bind(this));

      this.log('');
      this.log('');
    }
  },

  end: function () {
    this._displayMessages('info', 'Infos', 'cyan');
    this._displayMessages('success', 'Success', 'green');
    this._displayMessages('warn', 'Warnings', 'yellow');
    this._displayMessages('error', 'Errors', 'red');
  }
});
