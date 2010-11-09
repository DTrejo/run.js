h1. Why do you even care?

It allows you to easily run some code, and have it watch the all files in the current directory for changed. When a file changes, your code will be rerun. This makes it super easy to your code, and alt-tab to the terminal to see the results (or alt-tab to the browser while skipping the terminal :)

<pre>$ node path/to/run.js server.js

Starting: server.js
watched files:
./404.html
./index.html
./jqserve.js
./server.js
> server is listening on http://127.0.0.1:8080</pre>


// https://github.com/DTrejo/run.js
// Used to run code in a directory and rerun it if any files are changed.
// usage: node run.js servercode.js
// servercode.js is whatever js file you want to run with node.

// You can also ignore files that don't matter (like .DS_Store or whatever else).