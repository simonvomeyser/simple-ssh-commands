require("dotenv").config();
const colors = require("colors/safe");

/**
 * Handles Passwords.
 *
 * - Warns when it is provided in config
 * - Returns password from .env file otherwise
 */
module.exports = function parsePassword(args) {
  var args = args || {};
  var envKey = getEnvKey(args.configKey);
  var passwordInEnvFile = process.env[envKey];

  if (args.password) {
    showPasswordWarning();
    showEnvFileInfo(envKey);
    return args.password;
  }
  
  if (!passwordInEnvFile) {
    showEnvFileInfo(envKey);
  }

  return passwordInEnvFile || '';
};

/**
 * Returns the environment key the password is searched
 */
function getEnvKey(configKey) {
  if (configKey) {
    return "SSC_DEPLOY_PASSWORD_" + configKey.toUpperCase();
  } else {
    return "SSC_DEPLOY_PASSWORD";
  }
}

function showPasswordWarning() {
  console.warn(
    colors.yellow(
      "Simple SSH Commands: You provided your Password in your .simple-ssh-commands file. While this is supported, you should not commit this file."
    )
  );
}

function showEnvFileInfo(envKey) {
  console.log(
    colors.green(
      "Simple SSH Commands: You can add your Password to an .env file by adding the key " +
        envKey +
        " there."
    )
  );
}
