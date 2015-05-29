var gulp = require('gulp');
var $    = require('./utils/$');

gulp.task('icons:once', ['clean:icons'], function () {
  return gulp.src($.paths.icons.srcFiles)
    .pipe($.svgSprites({
      mode: 'symbols',
      preview: false,
      svgId: 'icon-%f',
      svg: {symbols: 'icons.svg'}
    }))
    .pipe(gulp.dest($.paths.icons.dest))<% if (has.server) { %>
    .pipe($.if($.config.live, $.reloadStream()))<% } %>;
});

gulp.task('icons:watch', ['icons:once'], function () {
  return $.watch($.paths.icons.srcFiles, {name: 'icons'}, function (files) {
    return gulp.start('icons:once');
  });
});

gulp.task('icons', [$.config.watch ? 'icons:watch' : 'icons:once']);
