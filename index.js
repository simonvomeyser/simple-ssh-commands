#!/usr/bin/env node

var colors = require('colors/safe');
const prompt = require('prompt');
const node_ssh = require('node-ssh');
const ssh = new node_ssh();

require('dotenv').config();

try {
    
    var config = require(process.cwd()+'/.ssh-commands.json');

} catch (error) {

    console.warn(colors.yellow("Simple SSH Commands: You are missing an '.ssh-commands' file in your root directory."));
    return;
    
}

const optionDefinitions = [
  { name: 'config-key', alias: 'c', type: String },
]
const commandLineArgs = require('command-line-args')
const options = commandLineArgs(optionDefinitions)

// Credendtials used to log in
const credentials = {
    username: config.username,
    host: config.host,
    password: process.env.DEPLOY_PASSWORD
  };
const commands = config.commands;
  
  // When the password exists (in .env file) don't ask for password
  if (credentials.password) {
    executeDeploy(credentials);
  } else {
    askForPassword(credentials)
      .then(credentialsWithPassword => executeDeploy(credentialsWithPassword))
      .catch(error => console.log('An error occured'));
  }
  
  /**
   * Prompts for password
   * @param {object} credentials
   * @return {Promise}
   */
  function askForPassword(credentials) {
    return new Promise((resolve, reject) => {
      console.log(
        'Enter Password for ' +
        credentials.username +
        '@' +
        credentials.host +
        ' (Or add DEPLOY_PASSWORD to your .env file)'
      );
  
      return prompt.get(['password'], function (err, result) {
        if (err) reject(err);
  
        credentials.password = result.password;
        resolve(credentials);
      });
    });
  }
  
  /**
   * Connects to the server with credentials and prints output to console
   * @param {object} credentials
   */
  function executeDeploy(credentials) {
    ssh.connect(credentials).then(function () {
      ssh.execCommand(commands.join(' && ') + ' \n').then(function (result) {
        console.log(result.stdout);
        console.log(result.stderr);
        ssh.dispose();
      });
    });
  }
  