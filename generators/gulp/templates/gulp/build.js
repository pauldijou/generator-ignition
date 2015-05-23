var gulp   = require('gulp');
var $      = require('./utils/$');

<% if (has.style && !has.css) { %>
gulp.task('styles:build', ['<%= props.style %>']);
<% } %>

gulp.task('scripts:build', $.config.scripts);

gulp.task('build', ['sprites', 'styles:build', 'scripts:build']);
