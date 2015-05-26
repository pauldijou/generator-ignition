var plugins = require('gulp-load-plugins')();
var argv    = require('yargs').argv;
var utils   = require('./utils');

// Expose all Gulp plugins found
module.exports = plugins;

<% if (has.server) { -%>
// Expose some functions to manage live reloading
var browserSync = require('browser-sync');

module.exports.reload = browserSync.reload;

module.exports.reloadStream = function () {
  return browserSync.reload({stream: true});
};
<% } -%>

// Expose some other modules (local or not)
module.exports.utils      = utils;
module.exports.paths      = require('./paths');
module.exports.del        = require('del');
module.exports.through2   = require('through2');
module.exports.lazypipe   = require('lazypipe');
module.exports.source     = require('vinyl-source-stream');

<% if (has.browserify) { -%>
module.exports.browserify = require('browserify');
module.exports.watchify   = require('watchify');
var browserifyTransforms = module.exports.browserifyTransforms = [];
<% if (has.babel) { %>browserifyTransforms.push(require('babelify'));<% } %>
<% if (has.traceur) { %>browserifyTransforms.push(require('es6ify'));<% } %>
<% if (has.coffeescript) { %>browserifyTransforms.push(require('coffeeify'));<% } %>
<% if (has.typescript) { %>browserifyTransforms.push(require('tsify'));<% } %>
<% } -%>

// Expose common useful filters
module.exports.filters = {
  log: function (file) {
    console.log(file.event, file.path);
    return true;
  },
  changed: function (file) {
    return utils.is.changed(file);
  }
};

// Expose functions to handle events
module.exports.on = {
  error: require('./onError')
};

// Expose all supported args from command line
var config = module.exports.config = {
  styles: [],
  scripts: [],
  frameworks: [],
  watch: argv.watch === undefined || argv.watch !== 'false',
  mocked: argv.mocked || argv.m,
  latency: argv.latency || 100,
  port: parseInt(argv.port, 10) || 8000,
  sync: argv.sync === undefined || argv.sync !== 'false',
  live: argv.live === undefined || argv.live !== 'false',
  autoprefixer: argv.autoprefixer && JSON.parse(argv.autoprefixer) || ['> 1%', 'last 2 versions', 'Firefox ESR', 'Opera 12.1']
};

<% if (has.style && !has.css) { -%>
config.styles.push('<%= props.style %>');
<% } -%>

<% if (has.browserify) { -%>
config.scripts.push('browserify');
<% } else if (has.script && !has.javascript) { -%>
config.scripts.push('<%= props.script %>');
<% } -%>
