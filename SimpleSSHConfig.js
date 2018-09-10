const fs = require('fs');
const find = require('lodash').find
const parsePassword = require('./parsePassword');

module.exports = function SimpleSSHConfig(configKey) {
  this.configFileContent = readConfigFile();

  this.parsedConfig = parseConfigFromFile(
    this.configFileContent,
    configKey
  );

  this.credentials = {
    username: this.parsedConfig.username,
    host: this.parsedConfig.host,
    password: parsePassword({ password: this.parsedConfig.password, configKey: configKey })
  };

  this.commands = this.parsedConfig.commands;

};

/**
 * Returns the content of the config file
 */
function parseConfigFromFile(configFileContent, configKey) {
  if (Array.isArray(configFileContent)) {
    
    return getChosenOrFirstConfigKey(configFileContent, configKey)

  }

  return configFileContent;
}

/**
 * Returns the given config key if it exists
 */
function getChosenOrFirstConfigKey(configFileArray, configKey) {
  
  if (configKey) {
    return find(configFileArray, {key: configKey}) || configFileArray[0];
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
}

/**
 * Helper to require an JSON file that has no .json extension
 */
function requireJSON(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}
