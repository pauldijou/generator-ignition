var plugins = require('gulp-load-plugins')();
var argv    = require('yargs').argv;
var utils   = require('./utils');

// ----------------------------------------------------------------------------
// Exposing stuff

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
module.exports.utils       = utils;
module.exports.paths       = require('./paths');
module.exports.del         = require('del');
module.exports.through2    = require('through2');
module.exports.lazypipe    = require('lazypipe');
module.exports.source      = require('vinyl-source-stream');
module.exports.runSequence = require('run-sequence');

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

// ----------------------------------------------------------------------------
// Configuration

var config = module.exports.config = require('./options');
config.styles = [];
config.scripts = [];
config.frameworks = [];

<% if (has.style && !has.css) { -%>
config.styles.push('<%= props.style %>');
<% } -%>

<% if (has.browserify) { -%>
config.scripts.push('browserify');
<% } else if (has.script && !has.javascript) { -%>
config.scripts.push('<%= props.script %>');
<% } -%>
