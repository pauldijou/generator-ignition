var gulp = require('gulp');
var $    = require('./utils/$');

gulp.task('build:styles', $.config.styles);

gulp.task('build:scripts', $.config.scripts);

gulp.task('build', ['build:styles', 'build:scripts']);
