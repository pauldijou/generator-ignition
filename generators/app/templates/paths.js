// All the paths exported in this file are
// relative to your project root

var folders = {
  <% if (has.script) { %>scripts: '<%= structure.scripts.getName() %>',<% } -%>
  <% if (has.style) { %>styles: '<%= structure.styles.getName() %>',<% } -%>
  <% if (has.images) { %>images: '<%= structure.images.getName() %>',<% } -%>
  <% if (has.build) { %>build: '<%= structure.build.getName() %>',<% } -%>
  <% if (has.test) { %>test: '<%= structure.test.getName() %>',<% } -%>
  <% if (has.test) { %>unit: '<%= structure.unit.getName() %>',<% } -%>
  <% if (has.test) { %>e2e: '<%= structure.e2e.getName() %>',<% } -%>
  bower: 'bower_components',
  npm: 'node_modules'
};

function getPath(folderName, subFolderName) {
  var subPath = subFolderName ? '/' + folders[subFolderName] : '';
  return './' + folders[folderName] + subPath;
}

<% if (has.build) { %>function getBuildPath(folderName) { return getPath('build', folderName) }<% } %>
<% if (has.test) { %>function getTestPath(folderName) { return getPath('test', folderName) }<% } %>
<%
var styleExtension = 'css';
if (has.sass) { styleExtension = 'scss' }
else if (has.less) { styleExtension = 'less' }
else if (has.stylus) { styleExtension = 'styl' }

var scriptExtension = 'js';
if (has.typescript) { scriptExtension = 'ts' }
else if (has.coffeescript) { scriptExtension = 'coffee' }
%>
module.exports = {
  <% if (has.style) { %>styles: {
    src: getPath('styles'),
    srcMain: getPath('styles') + '/app.<%= styleExtension %>',
    srcFiles: getPath('styles') + '/**/*.<%= styleExtension %>'<% if (has.build) { %>,
    dest: getBuildPath('styles'),
    destFiles: getBuildPath('styles') + '/**/*.css'<% } %>
  },<% } %>
  <% if (has.script) { %>scripts: {
    src: getPath('scripts'),
    srcMain: getPath('scripts') + '/app.<%= scriptExtension %>',
    srcFiles: getPath('scripts') + '/**/*.<%= scriptExtension %>'<% if (has.build) { %>,
    dest: getBuildPath('scripts'),
    destFiles: getBuildPath('scripts') + '/**/*.js'<% } %>
  },<% } %>
  stylus: {
    bower:getPath('bower') + '/**/*.styl',
    all: getPath('styles') + '/**/*.styl',
    main: getPath('styles') + '/app.styl'
  },
  templates: {
    all: './templates/**/*.html'
  },
  images: {
    all: ['./images/**/*', '!./images/icons/**/*.svg']
  },
  build: {
    dir: getPath('build')
  },
  deploy: {
    dir: './deploy'
  },
  test: {
    unit: {
      js: './test/unit/**/*.js',
      coffee: './test/unit/**/*.coffee',
      typescript: './test/unit/**/*.ts',
      dest: './build/test/unit',
      destFiles: './build/test/unit/**/*.js'
    },
    e2e: {
      js: './test/e2e/**/*.js',
      coffee: './test/e2e/**/*.coffee',
      typescript: './test/e2e/**/*.ts',
      dest: './build/test/e2e',
      destFiles: './build/test/e2e/**/*.js'
    }
  },
  npm: {
    src: getPath('npm')
  },
  bower: {
    src: getPath('bower')
  }
};
