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

Context.prototype.merge = function (name, obj) {
  _.merge(this[name], obj || {});
}

Context.prototype.concatUniq = function (name, dependencies) {
  this[name] = _.uniq(this[name].concat(dependencies || []));
}

Context.prototype.addGeneratorContext = function (context) {
  this.merge('props', context.props);
  this.merge('versions', context.versions);
  this.concatUniq('npm', context.npm);
  this.concatUniq('npmDev', context.npmDev);
  this.concatUniq('bower', context.bower);
}

Context.prototype.info = function (msg) { this.info.push(msg); }
Context.prototype.warn = function (msg) { this.warn.push(msg); }
Context.prototype.error = function (msg) { this.error.push(msg); }
Context.prototype.success = function (msg) { this.success.push(msg); }

module.exports = Context;
