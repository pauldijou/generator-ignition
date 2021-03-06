var gulp = require('gulp');
var $    = require('./gulp/utils/$');

require('require-dir')('./gulp', { recurse: true });

// Building the project
// (dynamic watch depending on command line options, see gulp/utils/$.js and gulp/utils/options.js )
var buildTasks = [];
buildTasks = buildTasks.concat($.config.styles);
buildTasks = buildTasks.concat($.config.scripts);

gulp.task('build', buildTasks);

// Default task will build the project<% if (has.server) { %>and serve it<% } %>
gulp.task('default', ['build'<% if (has.server) { %>, 'serve'<% } %>]);

// Deploy task will build the project and minify all assets inside the dist folder
// Watching will be disable by default in this task (see gulp/utils/$.js)
gulp.task('dist', function (done) {
  $.runSequence(['clean:dist', 'build'], 'useref', done);
});
<% if (has.server) { %>
// For final testing, serve the dist folder (you might want to force --watch)
gulp.task('dist:serve', ['dist', 'serve']);
<% } %>
// All doc on command line options should be available on GitHub
// but here is a little memento
//
// --watch: watch is true by default, but manually setting it using this option will override anything else that might automatically disable it, like the 'dist' task
// --no-watch: disable watching on files and incremental build, useful if you only want to build all files once
// --mock: if string, enable a mocked API using local JSON files rather than remote server. Value is used as the prefix url for the mock API.
// --latency: default to 100, set to a number to simulate an average network latency when using mocked API
// --port: default to 8000, set to number to assign the port number to use for the server
// --no-ghost: disable synchronized events (click, scroll, forms) on all devices
// --no-live: disable live-reloading of resources
// --autoprefixer: default to a nice value but can be overriden using a JSON, will be used to configure Autoprefixer plugin
//
// Examples:
// Build only once (the Gulp task will actually finish rather than pending like it would when watching)
// and reconfigure the Autoprefixer plugin
// gulp --no-watch --autoprefixer=['>5%', 'last 3 versions']
//
// Use a mocked API (loading JSON files from './api/v1'), increase the latency for it and assign a new port for the server
// gulp --mock=/api/v1 --latency=500 --port=80
