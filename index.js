#!/usr/bin/env node

const prompt = require('prompt');
const node_ssh = require('node-ssh');
const ssh = new node_ssh();
const configParser = require('./config-parser')
const colors = require('colors/safe');

var config = catchErrors(configParser.parseConfig);
  
// Credendtials used to log in

  // When the password exists (in .env file) don't ask for password
  if (config.credentials.password) {
    executeDeploy(config.credentials, config.commands);
  } else {
    askForPassword(config.credentials)
      .then(credentialsWithPassword => executeDeploy(credentialsWithPassword, config.commands))
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
        credentials.user +
        '@' +
        credentials.host
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
  function executeDeploy(credentials, commands) {
    ssh.connect(credentials).then(function () {
      ssh.execCommand(commands.join(' && ') + ' \n').then(function (result) {
        console.log(result.stdout);
        console.log(result.stderr);
        ssh.dispose();
      });
    });
  }

  function catchErrors(fn) {
    try {
      return fn();
    } catch (error) {
      throw new Error(colors.red("Simple SSH Commands Problem:\n") + colors.yellow(error.message));
    }
  }
  