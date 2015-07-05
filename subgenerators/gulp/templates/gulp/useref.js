var gulp = require('gulp');
var $    = require('./utils/$');

// var requireCompressionRegex = /\.(css|js)$/
//
// function requireCompression(file) {
//   return requireCompressionRegex.test(file.path);
// }

gulp.task('useref', function () {
  var assets = $.useref.assets();

  return gulp.src(['./index.html'], {base: '.'})
    .pipe(assets)
    .pipe($.if('*.js', $.uglify()))
    .pipe($.if('*.css', $.minifyCss()))
    .pipe($.rev())
    // .pipe($.ignore.include(requireCompression))
    .pipe(gulp.dest($.paths.dist.dest))
    .pipe($.size({title: 'Assets before compression'}))
    .pipe($.gzip())
    // Or, for a little better compression
    // but takes a bit more time
    // .pipe($.zopfli())
    .pipe($.size({title: 'Assets after compression'}))
    .pipe(assets.restore())
    .pipe($.useref())
    .pipe(gulp.dest($.paths.dist.dest));
});
