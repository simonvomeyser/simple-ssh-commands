#!/usr/bin/env node

const prompt = require('prompt');
const node_ssh = require('node-ssh');
const ssh = new node_ssh();
const configParser = require('./config-parser')
const colors = require('colors/safe');

require('dotenv').config();

var config = catchErrors(configParser.parseConfig);
  
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

  function catchErrors(fn) {
    try {
      return fn();
    } catch (error) {
      throw new Error(colors.red("Simple SSH Commands Problem:\n") + colors.yellow(error.message));
    }
  }
  