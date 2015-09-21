var fs = require('graceful-fs');
var path = require('path');
var yaml = require('js-yaml');
var root = path.resolve(__dirname, '..');

var generators;
function getGenerators() {
  if (!generators) {
    generators = fs.readdirSync(path.resolve(root, 'generators'));
  }

  return generators;
}

var subgenerators;
function getSubgenerators() {
  if (!subgenerators) {
    subgenerators = fs.readdirSync(path.resolve(root, 'subgenerators'));
  }

  return subgenerators;
}

// Return an array of generators that the user can call directly
// $yo ignition:angular2 -> illegal, you cannot run a subgenerator on its own
// $yo ignition:angular2:route -> ok, it's just a snippet
var composables;
function getSnippets() {
  var composables;

  function hasSubs(generator) {
    var subs = fs.readdirSync(path.resolve(root, 'subgenerators', generator));
    return subs.length > 1 && subs.indexOf('app') > -1;
  }

  function subs(generator) {
    return fs.readdirSync(path.resolve(root, 'subgenerators', generator)).filter(function (sub) {
      return sub !== 'app';
    }).map(function (sub) {
      return generator + ':' + sub;
    });
  }

  function flatten(acc, arr) {
    return acc.concat(arr);
  }

  if (!composables) {
    composables = getSubgenerators().filter(hasSubs).map(subs).reduce(flatten, []);
  }

  return composables;
}

function parseFrontMatter(content) {
  var regexp = /^(-{3}(?:\n|\r)([\w\W]+?)(?:\n|\r)-{3}(?:\n|\r))?([\w\W]*)*(?:\n|\r)$/;
  var matches = regexp.exec(content);

  return {
    headers: yaml.safeLoad(matches[2] || ''),
    content: matches[3] || ''
  };
}

function parseFileFrontMatter(filename) {
  return parseFrontMatter(fs.readFileSync(filename, {encoding: 'utf8'}));
}

module.exports = {
  root: root,
  getGenerators: getGenerators,
  getSubgenerators: getSubgenerators,
  getSnippets: getSnippets,
  parseFrontMatter: parseFrontMatter,
  parseFileFrontMatter: parseFileFrontMatter
};
