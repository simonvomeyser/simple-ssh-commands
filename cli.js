#!/usr/bin/env node

const SimpleSSHCommands = require("./SimpleSSHCommands");

const [,, ...args] = process.argv;

new SimpleSSHCommands(args);