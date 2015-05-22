var gulp   = require('gulp');
var $      = require('./utils/$');

var cleaners = [
  {name: 'styles'},
  {name: 'scripts'},
  {name: 'unit', path: $.paths.test.unit.build},
  {name: 'e2e', path: $.paths.test.e2e.build},
  {name: 'deploy', path: $.paths.deploy.dir}
];

cleaners.forEach(function (cleaner) {
  gulp.task('clean:'+cleaner.name, function () {
    return gulp.src(cleaner.path || $.paths[cleaner.name].build, {read: false})
      .pipe($.rimraf());
  });
});

gulp.task('clean', ['clean:styles', 'clean:scripts']);

gulp.task('clean:test', ['clean:unit', 'clean:e2e']);
