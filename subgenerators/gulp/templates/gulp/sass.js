<%- include('_style', {has: has, name: 'sass', plugin: 'sass'}); %>

var config = {
  style: 'expanded',
  precision: 10,
  loadPath: [
    $.paths.npm.src,
    $.paths.bower.src,
    $.paths.styles.src
  ]
};
