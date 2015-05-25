var gulp    = require('gulp');
var $       = require('./utils/$');

var config = {
  sourcemap: {
    inline: true,
    sourceRoot: '.',
    basePath: 'styles'
  }
};

<%- include('_style', {has: has, name: 'stylus', plugin: 'stylus'}); %>
