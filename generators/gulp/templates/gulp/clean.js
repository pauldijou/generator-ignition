var gulp   = require('gulp');
var $      = require('./utils/$');

var cleaners = [
  {name: 'styles'},
  {name: 'scripts'},
  {name: 'unit', path: $.paths.test.unit.dest},
  {name: 'e2e', path: $.paths.test.e2e.dest},
  {name: 'deploy', path: $.paths.deploy.dir}
];

cleaners.forEach(function (cleaner) {
  gulp.task('clean:'+cleaner.name, function (cb) {
    $.del([cleaner.path || $.paths[cleaner.name].dest], cb);
  });
});

gulp.task('clean', ['clean:styles', 'clean:scripts']);

gulp.task('clean:test', ['clean:unit', 'clean:e2e']);
