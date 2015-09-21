var gulp = require('gulp');
var $    = require('./utils/$');

var cleaners = [
  <% if (has.style) { %>{name: 'styles'},<% } %>
  <% if (has.script) { %>{name: 'scripts'},<% } %>
  <% if (has.test) { %>{name: 'unit', path: $.paths.test.unit.dest},<% } %>
  <% if (has.test) { %>{name: 'e2e', path: $.paths.test.e2e.dest},<% } %>
  <% if (has.icons) { %>{name: 'icons', path: $.paths.icons.destFiles},<% } %>
  {name: 'dist', path: $.paths.dist.dir}
];

cleaners.forEach(function (cleaner) {
  gulp.task('clean:'+cleaner.name, function (cb) {
    $.del([cleaner.path || $.paths[cleaner.name].dest], cb);
  });
});

var cleanTasks = [];
<% if (has.style) { %>cleanTasks.push('clean:styles');<% } %>
<% if (has.script) { %>cleanTasks.push('clean:scripts');<% } %>

gulp.task('clean', cleanTasks);

<% if (has.test) { %>gulp.task('clean:test', ['clean:unit', 'clean:e2e']);<% } %>
