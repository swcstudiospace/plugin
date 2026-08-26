# Usage and example | Node.js v26.5.0 Documentation

Source: https://nodejs.org/api/synopsis.html

## Usage and example[#](#usage-and-example)

### Usage[#](#usage)

`node [options] [V8 options] [script.js | -e "script" | - ] [arguments]`

Please see the [Command-line options](cli.html#options) document for more information.

### Example[#](#example)

An example of a [web server](http.html) written with Node.js which responds with
`'Hello, World!'`:

Commands in this document start with `$` or `>` to replicate how they would
appear in a user's terminal. Do not include the `$` and `>` characters. They are
there to show the start of each command.

Lines that don't start with `$` or `>` character show the output of the previous
command.

First, make sure to have downloaded and installed Node.js. See
[Installing Node.js via package manager](https://nodejs.org/en/download/package-manager/) for further install information.

Now, create an empty project folder called `projects`, then navigate into it.

Linux and Mac:

```
mkdir ~/projects
cd ~/projects

bashcopy
```

Windows CMD:

```
mkdir %USERPROFILE%\projects
cd %USERPROFILE%\projects

powershellcopy
```

Windows PowerShell:

```
mkdir $env:USERPROFILE\projects
cd $env:USERPROFILE\projects

powershellcopy
```

Next, create a new source file in the `projects`
folder and call it `hello-world.js`.

Open `hello-world.js` in any preferred text editor and
paste in the following content:

```
const http = require('node:http');

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello, World!\n');
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

jscopy
```

Save the file. Then, in the terminal window, to run the `hello-world.js` file,
enter:

```
node hello-world.js

bashcopy
```

Output like this should appear in the terminal:

```
Server running at http://127.0.0.1:3000/

consolecopy
```

Now, open any preferred web browser and visit `http://127.0.0.1:3000`.

If the browser displays the string `Hello, World!`, that indicates
the server is working.
