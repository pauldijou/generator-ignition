var gulp = require('gulp');
var $    = require('./utils/$');

var requireCompressionRegex = /\.(css|js)$/

function requireCompression(file) {
  return requireCompressionRegex.test(file.path);
}

gulp.task('usemin', ['clean:dist', 'build'], function () {
  return gulp.src(['./index.html'], {base: '.'})
    .pipe($.usemin({
      html: [$.minifyHtml({empty: true})],
      css:  ['concat', $.minifyCss(), $.rev()],
      js:   ['concat', $.uglify(), $.rev()]
    }))
    .pipe(gulp.dest($.paths.dist.dest))
    .pipe($.ignore.include(requireCompression))
    .pipe($.size({title: 'Assets before gzip compression'}))
    .pipe($.gzip())
    // Or, for a little better compression
    // but takes a bit more time
    // .pipe($.zopfli())
    .pipe($.size({title: 'Assets after gzip compression'}))
    .pipe(gulp.dest($.paths.dist.dest));
});
