// Extract all command lines options
var argv = require('yargs').argv;

// Default values (feel free to change them)
var options = {
  watch: true<% if (has.server) { %>,
  mock: false,
  sync: true,
  live: true,
  latency: '100',
  port: '8000'<% } %><% if (has.autoprefixer) { %>,
  autoprefixer: ['> 1%', 'last 2 versions', 'Firefox ESR', 'Opera 12.1']<% } %>
};

function read(name, map) {
  if (argv[name] !== undefined) {
    options[name] = map && map(argv[name]) || argv[name];
  }
}

function readInt(name) {
  read(name, function (value) { return parseInt(value, 10); });
}

function readBool(name) {
  read(name, function (value) { return value !== false && value !== 'false'; });
}

function readJSON(name) {
  read(name, JSON.parse);
}

<% if (has.server) { -%>
read('mock');
readBool('sync');
readBool('live');
readInt('latency');
readInt('port');
<% } -%>
<% if (has.autoprefixer) { %>readJSON('autoprefixer');<% } %>

// Flag to indicate if we are inside the "deploy" task
var isDeploying = (argv._[0] === 'deploy');

// So, the rule to dynamically compute if we are watching or not is a bit complex
// 1) If manually set to true by the user => override anything else
// 2) If deploying => no watching
// 3) If nothing => watching by default
// 4) If manually set to false => no watching obviously
var options.watch = (argv.watch === true) || (!isDeploying && argv.watch !== false));

module.exports = options;
