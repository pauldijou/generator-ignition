var gulp    = require('gulp');
var $       = require('./utils/$');

var config = {
  paths: [
    $.paths.npm.src,
    $.paths.bower.src,
    $.paths.styles.src
  ]
};

<%- include('_style', {has: has, name: 'less', plugin: 'less'}); %>
