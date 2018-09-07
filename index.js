#!/usr/bin/env node

const prompt = require("prompt");
const configParser = require("./config-parser");
const colors = require("colors/safe");
const Client = require("ssh2").Client;

const config = catchErrors(configParser.parseConfig);

// When the password exists (in .env file) don't ask for password
if (config.credentials.password) {
  executeDeploy(config.credentials, config.commands);
} else {
  askForPassword(config.credentials)
    .then(credentialsWithPassword =>
      executeDeploy(credentialsWithPassword, config.commands)
    )
    .catch(error => console.log("An error occured"));
}

/**
 * Prompts for password
 * @param {object} credentials
 * @return {Promise}
 */
function askForPassword(credentials) {
  return new Promise((resolve, reject) => {
    console.log(
      "Enter Password for " + credentials.user + "@" + credentials.host
    );

    return prompt.get(["password"], function(err, result) {
      if (err) reject(err);

      credentials.password = result.password;
      resolve(credentials);
    });
  });
}

/**
 * Connects to the server with credentials and prints the combined output to console
 * @param {object} credentials
 */
function executeDeploy(credentials, commands) {
  var conn = new Client();

  conn
    .on("ready", function() {
      conn.shell(function(err, stream) {
        if (err) throw err;

        var output = [];

        stream
          .on("close", function() {
            console.log(output.join(''))
            conn.end();
          })
          .on("data", function(data) {
            output.push(String(data));
          })
          .stderr.on("data", function(data) {
            console.log("STDERR: " + data);
          });
          stream.write(commands.join('\n\n')) ;
          stream.end('\n exit \n') ;
          
      });
    }).connect(credentials);
}

function catchErrors(fn) {
  try {
    return fn();
  } catch (error) {
    throw new Error(
      colors.red("Simple SSH Commands Problem:\n") +
        colors.yellow(error.message)
    );
  }
}
