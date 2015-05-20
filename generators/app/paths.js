var folders = {
  scripts: 'scripts',
  styles: 'styles',
  images: 'images',
  build: 'build',
  test: 'test',
  unit: 'unit',
  e2e: 'e2e',
  bower: 'bower_components',
  node: 'node_modules'
}

function getPath(folderName, subFolderName) {
  var subPath = subFolderName ? '/' + folders[subFolderName] : '';
  return './' + folders[folderName] + subPath;
}

function getBuildPath(folderName) { return getPath('build', folderName) }
function getTestPath(folderName) { return getPath('test', folderName) }

module.exports = {
  styles: {
    dir: getPath('styles'),
    build: getBuildPath('styles') + '/**/*.css',
    dest: getBuildPath('styles')
  },
  scripts: {
    dir: getPath('scripts'),
    build: getBuildPath('scripts') + '/**/*.js',
    dest: getBuildPath('scripts')
  },
  bower: {
    dir: getPath('bower')
  },
  coffee: {
    all: getPath('scripts') + '/**/*.coffee'
  },
  typescript: {
    all: getPath('scripts') + '/**/*.ts'
  },
  browserify: {
    main: getPath('scripts') + '/app.js'
  },
  sass: {
    all: getPath('styles') + '/**/*.scss',
    main: getPath('styles') + '/app.scss'
  },
  less: {
    all: getPath('styles') + '/**/*.less',
    main: getPath('styles') + '/app.less'
  },
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
      build: './build/test/unit/**/*.js'
    },
    e2e: {
      js: './test/e2e/**/*.js',
      coffee: './test/e2e/**/*.coffee',
      typescript: './test/e2e/**/*.ts',
      dest: './build/test/e2e',
      build: './build/test/e2e/**/*.js'
    }
  }
};
