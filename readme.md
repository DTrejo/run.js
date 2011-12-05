## Install

`$ npm install run`

## Usage

`$ runjs yourcode.js`

# What does it do?

`runjs` will rerun server.js whenever one of the watched files is
changed. It ignores files in your `.gitignore`.

    $ runjs server.js
    Watching /Dropbox/dev/server.js and all sub-directories not excluded by your .gitignore
    Found & ignored file.db ; is dotfile or has ignored extension

    Starting: server.js
    > Listening on http://localhost:8888/

No more switching to the terminal to rerun your code. Just change a file and
your code will be rerun.

This is especially nice for web-servers, as you can skip the terminal and
alt-tab to the browser to see your updated code happily running.

### Features
- supports globs in .gitignore (e.g. `*.log`)
- any arguments, including debug arguments, are relayed to your code
- **stdin is relayed to your code** [not supported by nodemon as of 12/5/11]
- files and directories in `.gitignore` are not watched, neither are dotfiles.
- coffeescript is supported: `runjs yourcode.coffee`
  (by [rockymeza](https://github.com/rockymeza))

Source at [github.com/DTrejo/run.js](https://github.com/DTrejo/run.js)

---
![Screenshot of runjs](https://github.com/DTrejo/run.js/raw/master/test/screenshot.png)
