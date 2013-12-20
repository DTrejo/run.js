module.exports = createRunner
var path = require('path')
var spawn = require('child_process').spawn
function l() { console.log.apply(console, arguments) }
/*
Returns a Runner object with three methods: start, kill, and restart.
Takes process.argv arrays of these forms and turns them into commands to run.

  hello.js -> node hello.js
  hello.coffee -> coffee hello.coffee
  arg1 arg2 -- node hello.js --debug-brk=1337 -> node hello.js --debug-brk=1337
*/
function createRunner(argv) {
  return new Runner(argv)
}
function Runner(argv) {
  var self = this

  // allow typing to reach the child, whichever one is running
  process.stdin.resume();
  process.stdin.setEncoding('utf8');

  var dashdash = argv.indexOf('--')
  if (dashdash > -1) {
    self.argv = argv.slice(dashdash + 1)

  } else if (path.extname(argv[0]) === '.coffee') {
    self.argv = [ 'coffee', argv[0] ]

  } else {
    self.argv = [ 'node', argv[0] ]
  }
  return self
}
Runner.prototype.start = function() {
  var self = this
  l('Starting `%s`', self.argv.join(' '))
  self.child = spawn(self.argv[0], self.argv.slice(1), { stdio: 'inherit' })
  self.child.on('close', function (code) {
    l('`%s` exited with code ' + code, self.argv.join(' '))
  })

  return self
}
Runner.prototype.kill = function() {
  var self = this
  // usually SIGNAL will be undefined, and node will use SIGTERM.
  self.child && self.child.kill(process.env.SIGNAL)
  return self
}
Runner.prototype.restart = function() {
  var self = this
  self.kill()
  self.start()
  return self
}

if (!module.parent) {
  var a = require('assert')
  a.deepEqual(createRunner(['hello.js']).argv, 'node hello.js'.split(' '))
  a.deepEqual(createRunner(['hello.coffee']).argv, 'coffee hello.coffee'.split(' '))

  var input = 'arg1 arg2 -- node hello.js --debug-brk=1337'.split(' ')
  var output = 'node hello.js --debug-brk=1337'.split(' ')
  a.deepEqual(createRunner(input).argv, output)

  createRunner('-- echo TESTOUTPUT'.split(' ')).start()
  createRunner('-- sleep 10'.split(' ')).start().kill()
  createRunner('-- node hij.js'.split(' ')).start()
}
