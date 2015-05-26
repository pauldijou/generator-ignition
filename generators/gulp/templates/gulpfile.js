var gulp = require('gulp');
var $    = require('./gulp/utils/$');

require('require-dir')('./gulp', { recurse: true });

gulp.task('default', [$.config.watch ? 'watch' : 'build', 'serve']);
