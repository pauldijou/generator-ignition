var config = {
  sourcemap: {
    inline: true,
    sourceRoot: '.',
    basePath: $.paths.scripts.src
  }
};

<%- include('_style', {has: has, name: 'stylus', plugin: 'stylus'}); %>
