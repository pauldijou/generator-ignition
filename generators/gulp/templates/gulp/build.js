var gulp   = require('gulp');
var $      = require('./utils/$');

<% if (props.style === 'sass') { %>
gulp.task('styles:build', ['sass']);
<% } else if (props.style ===)

gulp.task('scripts:build', $.config.scripts);

gulp.task('build', ['sprites', 'styles:build', 'scripts:build']);
