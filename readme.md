# What does it do?

`npm install run`

<pre>$ runjs server.js

Starting: server.js
watched files:
./404.html
./index.html
./jqserve.js
./server.js
> server is listening on http://127.0.0.1:8080</pre>

`runjs` will rerun server.js whenever one of the watched files is
changed.

No more switching to the terminal to rerun your code. Just change a file and
your code will be rerun.

This is especially nice for webservers, as you can skip the terminal and
alt-tab to the browser to see your updated code happily running.

## Install

`npm install run`

### Misc

- Usage: `runjs yourcode.js`
- Source at [https://github.com/DTrejo/run.js](https://github.com/DTrejo/run.js)


### Recent additions
- stdin is now recieved by the child process
- support for runjs `myfile.coffee` by [rockymeza](https://github.com/rockymeza)
