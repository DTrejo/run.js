// https://github.com/DTrejo/run.js
// Used to run code in a directory and rerun it if any files are changed.
// usage: node run.js servercode.js
// servercode.js is whatever js file you want to run with node.

// Excludes filetypes in the ignoreExtensions array
var util = require('util')
  , fs = require('fs')
  , path = require('path')
  , spawn = require('child_process').spawn
  , child // child process which runs the actual code
  , ignoreExtensions = ['.dirtydb', '.db']
  // So much hacky :)
  , ignoreFiles = (path.existsSync('.gitignore')
                  && fs.readFileSync('.gitignore')
                      .toString('utf8')
                      .split('\n')
                      .filter(function(s) {
                        return s.indexOf('#') !== 0 && s.length > 0;
                      })
                      .map(function(s) {
                        return './' + s;
                      })
                  ) || []
  // switched out for coffee depending on extension.
  , node = 'node'
  ;

console.log('watching', path.resolve('./'), 'and excluding the below files');
console.log('ignored files (via .gitignore):'
  , '\n\t' + ignoreFiles.join('\n\t'));
console.log('ignored extensions (via run.js):'
  , '\n\t' + ignoreExtensions.join('\n\t'));

if (process.argv.length !== 3) {
  console.log('Found ' + (process.argv.length - 1)
             + ' argument(s). Expected two.');
  console.log('Usage: \n  node run.js servercode.js');
  process.exit(1);
}

if (process.argv[2].match(/\.coffee$/)) node = 'coffee';

run();
watchFiles(parseFolder('.'), restart); // watch all files, restart if problem

process.stdin.resume();
process.stdin.setEncoding('utf8');

// executes the command given by the second argument
function run() {
  // run the server
  child = spawn(node, [process.argv[2]]);

  // let the child's output escape.
  child.stdout.on('data', function(data) {
    util.print(data);
  });
  child.stderr.on('data', function(error) {
    util.print(error);
  });

  // let the user's typing get to the child
  process.stdin.pipe(child.stdin);

  console.log('\nStarting: ' + process.argv[2]);
}

function restart() {
  // kill if running
  if (child) child.kill();

  // run it again
  run();
}

/**
* Parses a folder and returns a list of files
*
* @param root {String}
* @return {Array}
*/
function parseFolder(root) {
  var fileList = []
    , files = fs.readdirSync(root);

  files.forEach(function(file) {
    var path = root + '/' + file
      , stat = fs.lstatSync(path);

    // add to list
    if (stat !== undefined && !stat.isDirectory()) {
      fileList.push(path);
    }

    // recur if directory, ignore dot directories
    if (stat !== undefined
      && stat.isDirectory()
      && file.indexOf('.') !== 0
      && ignoreFiles.indexOf(path) === -1) {
      fileList = fileList.concat(parseFolder(path));
    } else if (ignoreFiles.indexOf(path) !== -1) {
      console.log('found & ignored', path, '; was listed in .gitignore');
    }
  });

  return fileList;
}


/**
* Adds change listener to the files
*
* @param files {Array}
*/
function watchFiles(files, callback) {

  var config = {  persistent: true, interval: 1 };

  files.forEach(function (file) {

    // don't watch things with given extensions, don't watch dotfiles.
    var ext = file.slice(file.lastIndexOf('.'), file.length);
    if (ignoreExtensions.indexOf(ext) !== -1 || file.indexOf('./.') === 0) {
      // console.log('ignored' + file);
      return;
    }
    if (ignoreFiles.indexOf(file) !== -1) {
      console.log('found & ignored', file, '; was listed in .gitignore');
      return;
    }

    // console.log(file);

    // if one of the files changes
    fs.watchFile(file, config, function (curr, prev) {

      if ((curr.mtime + '') != (prev.mtime + '')) {
        console.log(file + ' changed');

        if (callback !== undefined) {
          callback();
        }
      }
    });
  });
}
