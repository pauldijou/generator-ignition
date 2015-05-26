var gulp = require('gulp');
var $    = require('./utils/$');

function bundle(b, file, done) {
  var pipeline = b.bundle()
    .on('error', $.on.error)
    .pipe($.source(file.path))
    .pipe(gulp.dest($.paths.scripts.dest));

  if (!$.config.watch) {
    pipeline.on('end', done);
  }

  return pipeline;
}

gulp.task('browserify', function (done) {
  return gulp.src($.paths.scripts.srcMain)
    .pipe(function (done) {
      return $.through2.obj(function(file, enc, cb) {
        var b = $.browserify({
          cache: {},
          packageCache: {},
          fullPaths: true
        });

        $.config.browserifyTransforms.forEach(function (tr) {
          b.transform(tr);
        });

        b.add(file);

        if ($.config.watch) {
          b = $.watchify(b);
          b.on('update', function () {
            return bundle(b, file, done);
          });
        }

        return bundle(b, file, done);
      });
    });
});
