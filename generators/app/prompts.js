// Just to have a more readable index.js,
// all prompts are stored here
module.exports = function (generator) {
  var has = generator.prompts.has;
  var is = generator.prompts.is;
  var hasBuild = has('build');
  var hasStyle = has('style');
  var hasScript = has('script');
  var compose = generator.prompts.compose;

  return [{
    type: 'input',
    name: 'name',
    message: 'What\'s the name of your project?',
    default: generator.appname
  }, {
    type: 'list',
    name: 'build',
    message: 'Do you want to use a particular tool for your build?',
    store: true,
    choices: [
      {name: 'Gulp', value: 'gulp'},
      // {name: 'Grunt', value: 'grunt'},
      // {name: 'Brunch', value: 'brunch'},
      // {name: 'Broccoli', value: 'broccoli'},
      {name: 'None of them, I have my own stuff', value: false}
    ]
  }, {
    type: 'list',
    name: 'style',
    message: 'Do you want to use a CSS preprocessor?',
    default: 'sass',
    store: true,
    choices: [
      {name: 'SCSS / SASS', value: 'sass'},
      {name: 'LESS', value: 'less'},
      {name: 'Stylus', value: 'stylus'},
      {name: 'Nope, I\'m good, I will just write pure CSS', value: 'css'},
      {name: 'Nothing at all, no CSS needed', value: false}
    ],
    when: hasBuild
  }, {
    type: 'list',
    name: 'script',
    message: 'Do you want to use a JavaScript preprocessor?',
    default: 'babel',
    store: true,
    choices: [
      {name: 'Babel', value: 'babel'},
      {name: 'Traceur', value: 'traceur'},
      {name: 'CoffeeScript', value: 'coffeescript'},
      {name: 'TypeScript', value: 'typescript'},
      {name: 'None of them, I will use pure JavaScript for this project', value: 'javascript'},
      {name: 'Nothing at all, no JavaScript needed', value: false}
    ],
    when: hasBuild
  }, {
    type: 'list',
    name: 'loader',
    message: 'Do you need to use a module loader?',
    default: 'browserify',
    store: true,
    choices: [
      {name: 'Browserify', value: 'browserify'},
      {name: 'SystemJS', value: 'systemjs'},
      {name: 'Nope', value: false}
    ],
    when: hasBuild
  }, {
    type: 'list',
    name: 'packageManager',
    message: 'Which one is your favorite package manager?',
    default: 'npm',
    store: true,
    choices: [
      {name: 'NPM', value: 'npm'},
      {name: 'Bower', value: 'bower'},
      {name: 'jspm', value: 'jspm'},
      {name: 'None', value: false}
    ],
    when: hasBuild
  }, {
    type: 'checkbox',
    name: 'buildOthers',
    message: 'Do you need some extra goodies?',
    store: true,
    choices: [
      {name: ' Autoprefixer', value: 'autoprefixer'},
      {name: ' Sourcemaps', value: 'sourcemaps'},
      {name: ' Server', value: 'server'}
    ],
    when: hasBuild
  }, {
    type: 'list',
    name: 'test',
    message: 'Do you want to run some tests? If so, please pick a test runner',
    default: 'karma',
    store: true,
    choices: [
      {name: 'Karma', value: 'karma'},
      {name: 'No test on this project, there are no such thing as bugs in my code', value: false}
    ]
  }, {
    type: 'checkbox',
    name: 'karmaLaunchers',
    message: 'Which Karma launcher(s) do you want to install?',
    default: 'chrome',
    store: true,
    choices: [
      {name: 'Chrome', value: 'chrome'},
      {name: 'Firefox', value: 'firefox'},
      {name: 'Safari', value: 'safari'},
      {name: 'PhantomJS', value: 'phantomjs'}
    ],
    when: is('test', 'karma'),
    validate: function (answer) {
      if (answer.length === 0) {
        return 'You need to pick at least one launcher'
      } else {
        return true;
      }
    }
  }, {
    type: 'checkbox',
    name: 'karmaReporters',
    message: 'Which Karma reporter(s) do you want to use?',
    default: 'nested',
    store: true,
    choices: [
      {name: 'Nested', value: 'nested'},
      {name: 'JUnit', value: 'junit'},
      {name: 'Spec', value: 'spec'}
    ],
    when: is('test', 'karma'),
    validate: function (answer) {
      if (answer.length === 0) {
        return 'You need to pick at least one reporter'
      } else {
        return true;
      }
    }
  }];
};
