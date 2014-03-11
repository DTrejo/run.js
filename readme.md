## Install

`$ npm -g install run`

## Usage

`$ run yourcode.js`

`$ run yourcode.js -- echo "one of the files I require has changed!"`

# What does it do?

`run` will rerun server.js whenever one of the watched files is
changed. **It only watches files that your code requires** (in other words,
dependencies).

    $ run server.js
    watching server.js
    watching node_modules/minimatch/minimatch.js
      watching node_modules/minimatch/node_modules/lru-cache/lib/lru-cache.js
    watching hello.js
      watching goodbye.js
    Starting `node server.js`
    > Listening on http://localhost:8888/

No more switching to the terminal to rerun your code. Just change a file and
your code will be rerun. No more false-restarts caused by changes in compiled
assets (e.g. html or css).

This is especially nice for web-servers, as you can skip the terminal and
alt-tab to the browser to see your updated server code happily running.

### Features
- any arguments, including debug arguments, are relayed to your code
- colors in output will be preserved! (stdin/stdout pipes are inherited)
- supports arbitrary command running upon file change (all arguments after `--`
  are `spawned` when any dependency changes):
  `run hello.js -- node hello.js --debug-brk=1337`
- TODO installs any package you don't have (`npm install --save moduleName`)
- TODO fix the slowness of stdin pipe inheriting?
- TODO support `run server.coffee`
- TODO selectively recompute files to watch whenever a source file changes
  (if a dep is added for example, we want to watch it)

Source at [github.com/DTrejo/run.js](https://github.com/DTrejo/run.js)

---

<!-- TODO: screenshot of run.js -->

<!--

Ideal psuedo-code

if dep changes
  - scan file for new deps
    - if dep is not installed, install it, restart()
    - else restart()
  - scan file for removed deps
    - unwatch the removed dep (use refcount)
    - restart()
  - deps that were there last time
    - do nothing

if dep is deleted
  - unwatch it (automatic)
  - unwatch its sub-deps (use refcount)
  - restart()

 -->
