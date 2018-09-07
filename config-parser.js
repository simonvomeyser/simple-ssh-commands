const commandLineArgs = require("command-line-args");
const fs = require('fs');
const find = require('lodash').find
const colors = require('colors/safe');

require('dotenv').config();

const allowedCommandLineArgs = [
  { name: "config-key", alias: "c", type: String }
];

module.exports = {
  parseConfig: function() {
      var actualCommandLineArgs = commandLineArgs(allowedCommandLineArgs);

      var configFileContent = readConfigFile();

      var parsedConfig =  parseConfigFromFile(configFileContent, actualCommandLineArgs);

      var password = parsePassword(actualCommandLineArgs);

      var config = {
        credentials: {
          username: parsedConfig.username,
          host: parsedConfig.host,
          password: password
        },
        commands: parsedConfig.commands
      }

      return config;
  }
};

function parsePassword(actualCommandLineArgs) {

  var key = actualCommandLineArgs['config-key'];
  var envKey;
  var password;
  // Make different passwords possible
  if(key) {
    envKey = 'SSC_DEPLOY_PASSWORD_' + key.toUpperCase();
  } else {
    envKey = 'SSC_DEPLOY_PASSWORD';
  }

  password = process.env[envKey];

  if (!password) {
    console.log(colors.green('Simple SSH Commands: You can add your Password to an .env file by adding the key '+envKey+' there.'))
  }

  return password;

}

function parseConfigFromFile(configFileContent, actualCommandLineArgs) {
  if (Array.isArray(configFileContent)) {
    
    return getChosenOrFirstConfigKey(configFileContent, actualCommandLineArgs['config-key'])

  }

  return configFileContent;
}

function getChosenOrFirstConfigKey(configFileArray, key) {
  
  if (key) {
    return find(configFileArray, {key: key}) || configFileArray[0];
  }

  return configFileArray[0];

}

/**
 * Validates that there is an config file and returns it's content
 */
function readConfigFile() {
  const filePath = process.cwd() + "/.simple-ssh-commands";
  
  if (!fs.existsSync(filePath)) {
    throw new Error(
      "You are missing an '.simple-ssh-commands' file in your root directory."
    );
  }

  return requireJSON(filePath);
};

/**
 * Helper to require an JSON file that has no .json extension
 */
function requireJSON(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}
