var gulp    = require('gulp');
var $       = require('./utils/$');

var config = {
  style: 'expanded',
  precision: 10,
  'sourcemap=file': true,
  sourcemapPath: '../../scripts',
  loadPath: [
    $.paths.npm.src,
    $.paths.bower.src,
    $.paths.styles.src
  ]
};

<%- include('_style', {has: has, name: 'sass', plugin: 'sass'}); %>
