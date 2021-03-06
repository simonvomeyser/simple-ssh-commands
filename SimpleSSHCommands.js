const {prompt} = require("enquirer");
const Client = require("ssh2").Client;
const SimpleSSHConfig = require("./SimpleSSHConfig");

module.exports = function SimpleSSHCommands(arguments) {
  this.argument = Array.isArray(arguments) ? arguments[0] : '';

  const config = new SimpleSSHConfig(this.argument);

  if (config.credentials.password) {
    executeDeploy(config.credentials, config.commands);
  } else {
    askForPassword(config.credentials)
      .then(credentialsWithPassword =>
        executeDeploy(credentialsWithPassword, config.commands)
      )
      .catch((e) => console.log(e));
  }

  /**
   * Prompts for password
   * @param {object} credentials
   * @return {Promise}
   */
  function askForPassword(credentials) {

    return new Promise((resolve) => {
      console.log(
          "Enter Password for " + credentials.username + "@" + credentials.host
      );

      return prompt({
        type: 'password',
        name: 'password',
      }).then(({password}) => {
        credentials.password =password;
        resolve(credentials);
      })
      .catch((e) => console.log(e));
    });
  }

  /**
   * Connects to the server with credentials and prints the combined output to console
   * @param {object} credentials
   */
  function executeDeploy(credentials, commands) {
    var conn = new Client();
  
    conn
      .on('error', function() {
        console.log("Connection not possible. Do your credentials match?");
      })
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
            
        })
      })
      .connect(credentials)
  }
};
