'use strict';

module.exports = core.base.extend({
  initializing: function () {
    this.init();
  },

  configuring: function () {
    var structure = context.structure;
    var props = context.props;
    var has = context.has;
    var npmDev = [];

    structure.addFolder('gulp');
    structure.gulp.addFolder('utils');

    npmDev.push('require-dir');
    npmDev.push("del");
    npmDev.push("yargs");
    npmDev.push("through2");
    npmDev.push("lazypipe");
    npmDev.push("vinyl-source-stream");
    npmDev.push("run-sequence");
    npmDev.push('browser-sync');

    npmDev.push('gulp');
    npmDev.push('gulp-load-plugins');
    npmDev.push("gulp-if");
    npmDev.push("gulp-ignore");
    npmDev.push("gulp-size");
    npmDev.push("gulp-notify");
    npmDev.push("gulp-filter");
    npmDev.push("gulp-rev");
    npmDev.push("gulp-watch");
    npmDev.push("gulp-plumber");
    npmDev.push("gulp-useref");

    structure.add(this, 'gulpfile.js');
    structure.gulp.utils.add(this, '$.js');
    structure.gulp.utils.add(this, 'onError.js');
    structure.gulp.utils.add(this, 'utils.js');
    structure.gulp.utils.add(this, core.resolve('core/paths.js'), 'paths.js');
    structure.gulp.utils.add(this, core.resolve('core/options.js'), 'options.js');
    structure.gulp.add(this, 'clean.js');
    structure.gulp.add(this, 'serve.js');

    switch (props.style) {
      case 'sass':
        structure.gulp.add(this, 'sass.js');
        npmDev.push('gulp-sass');
        break;
      case 'less':
        structure.gulp.add(this, 'less.js');
        npmDev.push('gulp-less');
        break;
      case 'stylus':
        structure.gulp.add(this, 'stylus.js');
        npmDev.push('gulp-stylus');
        break;
    }

    if (has.browserify) {
      structure.gulp.add(this, 'browserify.js');
      npmDev.push('browserify');
      npmDev.push('watchify');

      switch (props.script) {
        case 'babel':
          npmDev.push('babelify');
          break;
        case 'traceur':
          npmDev.push('es6ify');
          break;
        case 'coffeescript':
          npmDev.push('coffeeify');
          break;
        case 'typescript':
          npmDev.push('tsify');
          break;
      }
    } else {
      switch (props.script) {
        case 'babel':
          structure.gulp.add(this, 'babel.js');
          npmDev.push('gulp-babel');
          break;
        case 'traceur':
          structure.gulp.add(this, 'traceur.js');
          npmDev.push('gulp-traceur');
          break;
        case 'coffeescript':
          structure.gulp.add(this, 'coffee.js');
          npmDev.push('gulp-coffee');
          break;
        case 'typescript':
          structure.gulp.add(this, 'typescript.js');
          npmDev.push('gulp-typescript');
          break;
      }
    }

    if (has.autoprefixer) {
      npmDev.push('gulp-autoprefixer');
    }

    if (has.sourcemaps) {
      npmDev.push('gulp-sourcemaps');
    }

    if (has.csslint) {
      npmDev.push('gulp-csslint');
    }

    if (has.jslint) {
      if (has.coffeescript) {
        npmDev.push('gulp-coffeelint');
        npmDev.push('coffeelint-stylish');
      } else if (has.typescript) {
        npmDev.push('gulp-tslint');
      } else {
        npmDev.push('gulp-eslint');
      }
    }

    if (props.test === 'karma') {
      props.karmaLaunchers.forEach(function (l) {
        npmDev.push('karma-' + l + '-launcher');
      });

      props.karmaReporters.forEach(function (l) {
        npmDev.push('karma-' + l + '-reporter');
      });
    }

    context.add({
      versions: require('./versions'),
      npmDev: npmDev
    });
  }
});
