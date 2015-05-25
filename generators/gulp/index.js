'use strict';
var Base = require('../app/base')

module.exports = Base.extend({
  initializing: function () {
    this.context = this.options.context;
    this.structure = this.context.structure;
  },

  configuring: function () {
    var props = this.context.props;
    var has = this.context.has;
    var npm = [];
    var npmDev = [];
    var bower = [];

    this.structure.addFolder('gulp');
    this.structure.gulp.addFolder('utils');

    npmDev.push('require-dir');
    npmDev.push("del");
    npmDev.push("yargs");
    npmDev.push("through2");
    npmDev.push("lazypipe");
    npmDev.push("vinyl-source-stream");

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

    this.structure.add(this, 'gulpfile.js');
    this.structure.gulp.utils.add(this, '$.js');
    this.structure.gulp.utils.add(this, 'onError.js');
    this.structure.gulp.utils.add(this, 'utils.js');
    this.structure.gulp.utils.add(this, '../../../../app/templates/paths.js', 'paths.js');
    this.structure.gulp.add(this, 'build.js');
    this.structure.gulp.add(this, 'clean.js');
    this.structure.gulp.add(this, 'watch.js');

    switch (props.style) {
      case 'sass':
        this.structure.gulp.add(this, 'sass.js');
        npmDev.push('gulp-sass');
        break;
      case 'less':
        this.structure.gulp.add(this, 'less.js');
        npmDev.push('gulp-less');
        break;
      case 'stylus':
        this.structure.gulp.add(this, 'stylus.js');
        npmDev.push('gulp-stylus');
        break;
    }

    switch (props.script) {
      case 'sass':
        this.structure.gulp.add(this, 'sass.js');
        npmDev.push('gulp-sass');
        break;
      case 'less':
        this.structure.gulp.add(this, 'less.js');
        npmDev.push('gulp-less');
        break;
      case 'stylus':
        this.structure.gulp.add(this, 'stylus.js');
        npmDev.push('gulp-stylus');
        break;
    }

    if (has.autoprefixer) {
      npmDev.push('gulp-autoprefixer');
    }

    if (has.sourcemaps) {
      npmDev.push('gulp-sourcemaps');
    }

    if (has.server) {
      npmDev.push('browser-sync');
      this.structure.gulp.add(this, 'serve.js');
    }

    if (props.test === 'karma') {
      props.karmaLaunchers.forEach(function (l) {
        npmDev.push('karma-' + l + '-launcher');
      });

      props.karmaReporters.forEach(function (l) {
        npmDev.push('karma-' + l + '-reporter');
      });
    }

    this.context.addGeneratorContext({
      versions: require('./versions'),
      npm: npm,
      npmDev: npmDev,
      bower: bower
    });
  },

  writing: function () {

    this.log('Writing gulp files');

  }
});
