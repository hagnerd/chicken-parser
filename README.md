# chicken-parser

## Installation
Right now the package isn't hosted on NPM, so you'll have to git clone the repo, cd into the directory, and `yarn install` or `npm install`.

After that is done, to make the package globally available on your system, run `yarn link` or `npm link`.

If something isn't working, check the file file permissions for `cli.js`. Make sure it has executable permissions by running `ls -l` and checking if there is an `x` in the line of its permissions. If there isn't, then run `chmod +x cli.js`.

## Usage
The CLI exposes a single command `chicken-parser`. It will prompt you for:
1. The full name of the character
2. The display name of the character
3. The label/output filename
4. The desired output directory
5. The path to the input file.
