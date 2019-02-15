# Simple SSH Commands

[![Build Status](https://travis-ci.org/simonvomeyser/simple-ssh-commands.svg?branch=master)](https://travis-ci.org/simonvomeyser/simple-ssh-commands)

This package aims to make executing simple SSH Commands like a `git pull`  on your server as easy as possible. It also has a better approach to handle passwords than other packages.

All you will need is a config file with credentials (username and host) and your commands.

## How to install and prepare

```js
npm install simple-ssh-commands --save-dev
```

Then create a `.simple-ssh-commands` file in the same folder as your `package.json`. The content of the file should be valid JSON. Here is an example:

```json
// .simple-ssh-commands file
{
    "username": "Test",
    "host": "example.com",
    "commands": ["cd /var/www/website", "ls -la"]
}
```

And **that's basically it**. You can run the commands by calling the binary directly:

```
node_modules/.bin/simple-ssh-commands
```

or add a script to your `package.json` like so:

```json
// package.json
{
    ...
    "scripts": [
        ...
        "execute-ls-on-server": "simple-ssh-commands",
        ...
    ]
    ...
}
```

and then run `npm run execute-ls-on-server` or whatever you named you script.

## Password handling

Passwords *can* be added to your `.simple-ssh-commands` file. This is only a good idea if you do not commit this file though. 

This Package supports two other ways to handle your passwords:

1. If you don't add it to your `.simple-ssh-commands` file you will be prompted every time to enter it when you want to run the commands. Just enter password and the commands will be run.

2. If this process is to cumbersome for you, there is the possibility to create a `.env` file (if you don't already have one) in your projects root. You can add the key value pair `SSC_PASSWORD=12345` (with your password) to it. The password will be taken from there if the key is found.

## Multiple connections and commands

This package supports multiple connections or different commands for the same connection that can be placed in an Array in the `.simple-ssh-commands` file.

```json
// .simple-ssh-commands file
[
    {
        "key": "show-content",
        "username": "name",
        "host": "example.com",
        "commands": ["cd /var/www/website", "ls -la"]
    },
    {
        "key": "git-pull",
        "username": "name",
        "host": "example.com",
        "commands": ["cd /var/www/website", "git pull"]
    }
]
```

If you still call the `simple-ssh-commands` command without an argument the first key of the array will be used. But you are now able to pass the name of the key that should be run. Here is an example of a `package.json` file using the feature.

```json
// package.json
{
  "name": "test",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "show-content": "simple-ssh-commands show-content",
    "git-pull": "simple-ssh-commands git-pull"
  },
  "author": "Simon vom Eyser",
  "license": "ISC"
}
```

Passwords in your `.env` file will need the commands name as a postfix (uppercase with underscores for dashes) though.

```env
SSC_PASSWORD_SHOW_CONTENT=12345
SSC_PASSWORD_GIT_PULL=12345
```

# Roadmap

- Add the possibility to pass a SSH-Key and use that
- Improve server output display since it is still quite confusing.