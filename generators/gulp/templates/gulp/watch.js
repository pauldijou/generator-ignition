var gulp   = require('gulp');
var $      = require('./utils/$');

gulp.task('html:watch', function () {
  return $.watch(['./index.html', $.paths.templates.all], {name: 'Html'}, function (files, cb) {
    return gulp.start('sync:reload', cb);
  });
});

<% if (with.style && !with.css) { %>
gulp.task('styles:watch', ['<%= props.style %>:watch'] }));

<% } %>
<% if (with.script && !with.javascript) { %>
gulp.task('scripts:watch', ['<%= props.script %>:watch'] }));

<% } %>
gulp.task('watch', ['sprites', 'styles:watch', 'scripts:watch', 'html:watch']);
