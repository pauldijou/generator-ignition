'use strict';
var chalk = require('chalk');
var yosay = require('yosay');
var versions = require('./versions');
var Context = require('./context');
var Base = require('./base');
var structure = require('./structure');
var versions = require('./versions');

module.exports = Base.extend({
  initializing: {
    options: function () {
      // console.log(this.engine);
      // this.remote('pauldijou', 'gulp-kickoff', function (error, remote) {
      //   console.log(remote.engine);
      //   console.log(remote);
      //   remote.template('package.json', './package.json');
      // });
      console.log(__dirname);
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
      this.delimiter();
      done();
    }.bind(this));
  },

  configuring: function () {
    var props = this.props;
    var npm = [];
    var npmDev = [];
    var bower = [];

    this.structure.add(this, 'gitignore', '.gitignore');
    this.structure.add(this, '_package.json', 'package.json');

    if (props.build) {
      this.context.has.build = true;
      this.context.has[props.build] = true;
      this.structure.addFolder('build');
    }

    if (props.style) {
      this.context.has.style = true;
      this.context.has[props.style] = true;
      this.structure.addFolder('styles');
    }

    if (props.script) {
      this.context.has.script = true;
      this.context.has[props.script] = true;
      this.structure.addFolder('scripts');
    }

    props.buildOthers.forEach(function (o) {
      this.context.has[o] = true;
    }.bind(this));

    if (props.test) {
      this.context.has.test = true;
      this.structure.addFolder('test');
      this.structure.test.addFolder('unit');
      this.structure.test.addFolder('e2e');
    }

    switch (props.style) {
      case 'sass':
        this.structure.styles.add(this, 'app.scss');
        break;
      case 'less':
        this.structure.styles.add(this, 'app.less');
        break;
      case 'stylus':
        this.structure.styles.add(this, 'app.styl');
        break;
      case 'css':
        this.structure.styles.add(this, 'app.css');
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
    this.log('Setup done.');
    this.delimiter();
  },

  composition: function () {
    this.getGenerators().forEach(function (gen) {
      if (this.context.has[gen]) {
        this._composeWith(gen);
      }
    }.bind(this))
  },

  organization: function () {
    var self = this;
    var done = this.async();
    this.log('Here is the structure of the application I\'m about to create for you:');
    this.log('');
    this.log(this.structure.toTree());
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

  _getTemplateOf: function (file) {
    return file.generator.templatePath(file.getTemplatePath());
  },

  _getDestinationOf: function (file) {
    // return this.destinationPath(this.engine(file.getDestinationPath(), this.context));
    return this.destinationPath(file.getDestinationPath());
  },

  writing: function () {
    this.delimiter();
    this.log('Thanks for all your answers! Time for me to work now.');

    this.structure.forEachFile(function (file) {
      var from = this._getTemplateOf(file);
      var to = this._getDestinationOf(file);
      this.debug('Templating from ' + from + ' to ' + to);
      this.template(from, to, this.context)
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
      var dependencies = this._appendVersion(this.context.npm)

      if (dependencies.length > 0) {
        // this.npmInstall(dependencies, { 'save': true })
      }
    },

    devDependencies: function () {
      var devDependencies = this._appendVersion(this.context.npmDev)

      if (devDependencies.length > 0) {
        // this.npmInstall(devDependencies, { 'saveDev': true })
      }
    }
  },

  _displayMessages: function (property, title, color) {
    if (this.context[property].length > 0) {
      this.log('--------------------------------------------------------------------');
      this.log('- ' + chalk[color].bold(title));
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
