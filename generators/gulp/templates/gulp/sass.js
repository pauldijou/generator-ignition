var gulp    = require('gulp');
var $       = require('./utils/$');

var config = {
  style: 'expanded',
  precision: 10,
  'sourcemap=file': true,
  sourcemapPath: '../../scripts',
  loadPath: [
    $.paths.bower.dir,
    $.paths.styles.dir
  ]
};

gulp.task('sass', ['clean:styles'], function () {
  return gulp.src($.paths.sass.main)
    .pipe($.plumber({errorHandler: $.on.error}))
    .pipe($.rubySass(config))
    .pipe($.filter('**/*.css'))
    .pipe($.autoprefixer($.config.autoprefixer))
    .pipe(gulp.dest($.paths.styles.dest))
    .pipe($.size({title: 'Sass'}))
    .pipe($.if($.config.live, $.reloadStream()));
});

gulp.task('sass:watch', ['sass'], function () {
  return $.watch($.paths.sass.all, {name: 'Sass'}, function (files, cb) {
    return gulp.start('sass', cb);
  });
});
