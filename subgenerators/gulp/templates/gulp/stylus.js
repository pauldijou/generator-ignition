<%- include('_style', {has: has, name: 'stylus', plugin: 'stylus'}); %>

var config = {
  sourcemap: {
    inline: true,
    sourceRoot: '.',
    basePath: $.paths.scripts.src
  }
};
