var _ = require('lodash');

function Context(opts) {
  this.structure = opts.structure;
  this.options = opts.options;
  this.props = opts.props || {};
  this.versions = opts.versions || [];
  this.has = {};

  this.bower = [];
  this.npm = [];
  this.npmDev = [];

  this.info = [];
  this.warn = [];
  this.error = [];
  this.success = [];
}

Context.prototype.addProps = function (props) {
  _.merge(this.props, props || {});
}

Context.prototype.addVersions = function (versions) {
  _.merge(this.versions, versions || {});
}

Context.prototype.addBowerDependencies = function (dependencies) {
  this.bower = _.uniq(this.bower.concat(dependencies || []));
}

Context.prototype.addNpmDependencies = function (dependencies) {
  this.npm = _.uniq(this.npm.concat(dependencies || []));
}

Context.prototype.addNpmDevDependencies = function (dependencies) {
  this.npmDev = _.uniq(this.npmDev.concat(dependencies || []));
}

Context.prototype.addGeneratorContext = function (context) {
  this.addProps(context.props);
  this.addVersions(context.versions);
  this.addBowerDependencies(context.bower);
  this.addNpmDependencies(context.npm);
  this.addNpmDevDependencies(context.npmDev);
}

Context.prototype.info = function (msg) { this.info.push(msg); }
Context.prototype.warn = function (msg) { this.warn.push(msg); }
Context.prototype.error = function (msg) { this.error.push(msg); }
Context.prototype.success = function (msg) { this.success.push(msg); }

module.exports = Context;
