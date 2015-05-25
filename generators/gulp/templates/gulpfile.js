var gulp = require('gulp');

require('require-dir')('./gulp', { recurse: true });

// We don't need to call the 'build' task since all watch tasks
// will first trigger a full build of their own ressources before
// watching them, just to be sure to start with a clean state.
gulp.task('default', ['watch', 'serve']);
