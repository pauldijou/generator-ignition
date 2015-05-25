var gulp   = require('gulp');
var $      = require('./utils/$');

gulp.task('watch:html', function () {
  return $.watch(['./index.html', $.paths.templates.all], {name: 'Html'}, function (files, cb) {
    return gulp.start('sync:reload', cb);
  });
});

gulp.task('watch:styles', $.config.styles.map(function (s) { return s + ':watch';}));

gulp.task('watch:scripts', $.config.scripts.map(function (s) { return s + ':watch';}));

gulp.task('watch', ['watch:styles', 'watch:scripts', 'watch:html']);
