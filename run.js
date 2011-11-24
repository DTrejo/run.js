// https://github.com/DTrejo/run.js
// Used to run code in a directory and rerun it if any files are changed.
// Usage: ./cli.js servercode.js
// Where servercode.js is whatever js file you want node to run

// Excludes filetypes in the ignoreExtensions array
var util = require('util')
  , fs = require('fs')
  , path = require('path')
  , spawn = require('child_process').spawn
  , glob = require('glob')
  , child // child process which runs the user's code
  , ignoreExtensions = ['.dirtydb', '.db']
  , ignoreFiles = []
  // switched out for coffee depending on extension.
  , node = 'node'

//
// Tell user the correct usage if they miss-type
//
if (process.argv.length <= 2) {
  console.log('Found ' + (process.argv.length - 2)
    , 'argument(s). Expected one or more.')
  console.log('Usage: \n  runjs somecode.js\nOr:  \n  runjs somecode.js --args')
  process.exit(1)
}

//
// use `coffee` if the file ends with .coffee
//
if (process.argv[2].match(/\.coffee$/)) node = 'coffee'

//
// Exclude files based on .gitignore
//
if (path.existsSync('.gitignore')) {
  ignoreFiles = fs.readFileSync('.gitignore', 'utf8')
    .split('\n')
    .filter(function(s) {
      s = s.trim()
      return s.indexOf('#') !== 0 && s.length > 0
    })
}

console.log('Watching', path.resolve('./'), 'and all sub-directories not'
  , 'excluded by your .gitignore. Will not monitor dotfiles.')

watchFiles(parseFolder('.'), restart) // watch all files, restart if problem
run()


process.stdin.resume()
process.stdin.setEncoding('utf8')

// executes the command given by the second argument
;function run() {
  // run the server
  var args = process.argv.slice(2) || []
  child = spawn(node, args)

  // let the child's output escape.
  child.stdout.on('data', function(data) {
    util.print(data)
  })
  child.stderr.on('data', function(error) {
    util.print(error)
  })

  // let the user's typing get to the child
  process.stdin.pipe(child.stdin)

  console.log('\nStarting: ' + args.join(' '))
}

;function restart() {
  // kill if running
  if (child) child.kill()

  // run it again
  run()
}

/**
* Parses a folder recursively and returns a list of files
*
* @param root {String}
* @return {Array}
*/
;function parseFolder(root) {
  var fileList = []
    , files = fs.readdirSync(root)

  files.forEach(function(file) {
    var pathname = path.join(root, file)
      , stat = fs.lstatSync(pathname)

    if (stat === undefined) return

    // add files to file list
    if (!stat.isDirectory()) {
      fileList.push(pathname)

    // recur if directory
    } else {
      fileList = fileList.concat(parseFolder(pathname))
    }
  })

  return fileList
}


/**
* Add change listener to files, which is called whenever one changes.
* Ignores certain extensions.
*
* @param files {Array}
* @param callback {function}
*/
;function watchFiles(files, callback) {

  var config = {  persistent: true, interval: 1 }
  files.forEach(function (file) {

    // don't watch dotfiles.
    if (file.indexOf('.') === 0) return

    // don't watch things with ignored extensions
    var ext = path.extname(file)
    if (ignoreExtensions.indexOf(ext) !== -1) {
      console.log('Found & ignored', './' + file, '; has ignored extension')
      return
    }

    // don't watch files matched by .gitignore regexes
    for (var i = 0, pattern; pattern = ignoreFiles[i]; i++) {
      if (glob.fnmatch(pattern, file)) {
        console.log('Found & ignored', './' + file, '; is listed in .gitignore')
        return
      }
    }

    // if any file changes, run the callback
    fs.watchFile(file, config, function (curr, prev) {

      if ((curr.mtime + '') != (prev.mtime + '')) {
        console.log('./' + file + ' changed')
        if (callback) callback()
      }
    })
  })
}
