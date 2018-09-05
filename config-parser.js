const commandLineArgs = require("command-line-args");
const fs = require('fs');
const find = require('lodash').find

const allowedCommandLineArgs = [
  { name: "config-key", alias: "c", type: String }
];
const actualCommandLineArgs = commandLineArgs(allowedCommandLineArgs);

module.exports = {
  parseConfig: function() {
      var configFileContent = readConfigFile();

      return parseConfigFromFile(configFileContent, actualCommandLineArgs);
  }
};

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
