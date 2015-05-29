// Contains the global context of the generator
// It is passed to any sub-generator composed with the original one
// It is *not* DRY, information *is* duplicated to make life easier

// Sub-generators should compile all their own context and then use ".add"
// to merge it with the global one.
// Sub-generators can also use ".info", ".success", ".warn" and ".error" to
// display messages at the end of the process.

// This context is also the one used in all templates.

var _ = require('lodash');
var packages = require('./packages');

function Context() {
  // Generic stuff from the core generator
  this.generator = undefined;
  this.structure = undefined;
  this.options = {};

  // All answers to props merged into one object
  this.props ={};
  // All versions merged
  this.versions = [];
  // Object storing all flags indicating which features are enabled
  this.has = {};
  // Packages (frameworks, libs, polyfills) to install at the end of the process
  this.packages = [];

  // All dependencies to install at the end of the process
  // (all packages will be automatically added at the end so it's mostly dev dependencies)
  this.npm = [];
  this.npmDev = [];
  this.bower = [];
  this.bowerDev = [];

  // Messages to display at the end
  this.info = [];
  this.warn = [];
  this.error = [];
  this.success = [];
}

Context.prototype.merge = function (name, obj) {
  _.merge(this[name], obj || {});
}

Context.prototype.concatUniq = function (name, values) {
  this[name] = _.uniq(this[name].concat(values || []));
}

Context.prototype.add = function (context) {
  this.merge('props', context.props);
  this.merge('versions', context.versions);
  this.concatUniq('packages', context.packages);
  this.concatUniq('npm', context.npm);
  this.concatUniq('npmDev', context.npmDev);
  this.concatUniq('bower', context.bower);
  this.concatUniq('bowerDev', context.bowerDev);

  _.forOwn(context.has, function (value, key) {
    if (this.has[key]) {
      this.generator.error('Property ['+ key +'] has already been set in the context. Should never set it twice. Please report problem.');
    } else {
      this.has[key] = true;
    }
  }.bind(this));
}

var installHierarchy = {
  npm: ['npm', 'bower', 'github'],
  bower: ['bower', 'github'],
  jspm: ['npm', 'github']
};

Context.prototype.install = function () {
  var localContext = {versions: {}, npm: [], bower: []};

  if (this.props.packageManager) {
    var hierarchy = installHierarchy[this.props.packageManager] || [];

    this.packages.forEach(function (name) {
      var pack = packages[name];
      hierarchy.reduce(function (done, h) {
        if (!done) {
          if (pack[h]) {
            localContext[h].push(pack[h]);
            localContext.versions[name] = pack.version;
          } else {
            return false;
          }
        }
        return true;
      }, false)
    });
  }

  this.add(localContext);
}

Context.prototype.info = function (msg) { this.info.push(msg); }
Context.prototype.warn = function (msg) { this.warn.push(msg); }
Context.prototype.error = function (msg) { this.error.push(msg); }
Context.prototype.success = function (msg) { this.success.push(msg); }

Context.prototype.toString = function () {
  return require('util').inspect(this, {depth: null})
};

module.exports = new Context();
