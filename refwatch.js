var chokidar = require('chokidar')
var watcher = chokidar.watch([], { persistent: true })
var path = require('path')
function l() { console.log.apply(console, arguments) }

module.exports = {
  watch: watch,
  unwatch: unwatch,
  watcher: watcher,
  clear: clear
}

var tracked = {}

// assumes that you pass it absolute file paths
function watch(file, indent) {
  indent = indent || ''
  tracked[file] = tracked[file] || 0
  tracked[file]++

  // first time seeing it
  if (tracked[file] === 1) {
    l(indent + 'watching %s', path.relative(process.cwd(), file))
    watcher.add(file)
  }
}

function unwatch(file) {
  if (tracked[file] > 0) tracked[file]--

  if (tracked[file] == 0) {
    // chokidar does not yet support unwatching, so do nothing
    return l('TODO unwatch %s', file)
  }
}

function clear() {
  tracked = {}
}
