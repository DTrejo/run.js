module.exports = install

var spawn = require('child_process').spawn
var which = require('which').sync
var command = which('npm')
function l() { console.log.apply(console, arguments) }

function install(names, cb) {
  var args = [ 'install' ].concat(names)
  var options = { stdio: 'inherit', env: { NPM_CONFIG_COLOR: 'always' } }
  // l('install', command, args, options)
  var child = spawn(command, args, options)
  child.on('close', cb)
}
