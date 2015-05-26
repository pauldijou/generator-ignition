// All the paths exported in this file are
// relative to your project root

var folders = {
  <% if (has.script) { %>scripts: '<%= structure.scripts.getName() %>',<% } -%>
  <% if (has.style) { %>styles: '<%= structure.styles.getName() %>',<% } -%>
  <% if (has.images) { %>images: '<%= structure.images.getName() %>',<% } -%>
  <% if (has.icons) { %>icons: '<%= structure.images.icons.getName() %>',<% } -%>
  <% if (has.templates) { %>templates: '<%= structure.templates.getName() %>',<% } -%>
  <% if (has.build) { %>build: '<%= structure.build.getName() %>',<% } -%>
  <% if (has.build) { %>deploy: '<%= structure.deploy.getName() %>',<% } -%>
  <% if (has.test) { %>test: '<%= structure.test.getName() %>',<% } -%>
  <% if (has.test) { %>unit: '<%= structure.unit.getName() %>',<% } -%>
  <% if (has.test) { %>e2e: '<%= structure.e2e.getName() %>',<% } -%>
  bower: 'bower_components',
  npm: 'node_modules'
};

function getPath(folderName, subFolderName) {
  var subPath = subFolderName ? '/' + folders[subFolderName] : '';
  return folders[folderName] + subPath;
}

<% if (has.build) { %>function getBuildPath(folderName) { return getPath('build', folderName) }<% } %>
<% if (has.test) { %>function getTestPath(folderName) { return getPath('test', folderName) }<% } %>
<%
var styleExtension = 'css';
if (has.sass) { styleExtension = 'scss'; }
else if (has.less) { styleExtension = 'less'; }
else if (has.stylus) { styleExtension = 'styl'; }

var scriptExtension = 'js';
if (has.typescript) { scriptExtension = 'ts'; }
else if (has.coffeescript) { scriptExtension = 'coffee'; }

var templateExtension = 'html';
if (has.ejs) { templateExtension = 'ejs'; }
else if (has.handlebars) { templateExtension = 'hb'; }
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
  <% if (has.templates) { %>templates: {
    src: getPath('templates'),
    srcFiles: getPath('templates') + '/**/*.html'
  },<% } %>
  <% if (has.images) { %>images: {
    src: getPath('images'),
    srcFiles: [getPath('images') + '/**/*', '!'+getPath('images')+'/icons/**/*.svg'],
    dest: getBuildPath('images'),
    destFiles: [getBuildPath('images') + '/**/*', '!'+getBuildPath('images')+'/icons/**/*.svg']
  },<% } %>
  <% if (has.icons) { %>icons: {
    src: getPath('images', 'icons'),
    srcFiles: getPath('images', 'icons') +'/**/*.svg',
    dest: getBuildPath('images') + '/icons',
    destFiles: getBuildPath('images') + '/icons/**/*.svg'<% } %>
  },<% } %>
  <% if (has.build) { %>build: {
    src: getPath('build')
  },
  deploy: {
    src: getPath('deploy')
  },<% } %>
  <% if (has.test) { %>test: {
    unit: {
      src: getTestPath('unit') ,
      srcFiles: getTestPath('unit') + '/**/*.<%= scriptExtension %>',
      dest: getBuildPath('test') + '/' + folders.unit,
      destFiles:  getBuildPath('test') + '/' + folders.unit + '/**/*.js'
    },
    e2e: {
      src: getTestPath('e2e'),
      srcFiles: getTestPath('e2e') + '/**/*.<%= scriptExtension %>',
      dest: getBuildPath('test') + '/' + folders.e2e,
      destFiles:  getBuildPath('test') + '/' + folders.e2e + '/**/*.js'
    }
  },<% } %>
  npm: {
    src: getPath('npm')
  },
  bower: {
    src: getPath('bower')
  }
};
