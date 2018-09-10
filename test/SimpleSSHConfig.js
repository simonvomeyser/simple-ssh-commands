const assert = require("assert");
const mock = require("mock-fs");
const SimpleSSHConfig = require("../SimpleSSHConfig");

const configFileMockSingle = require("./configFileMockSingle.json");
const configFileMockArray = require("./configFileMockArray.json");

describe("Simple SSH Config", function() {
  afterEach(function() {
    mock.restore()
  });

  it("Should throw when there is now config file", function() {
    assert.throws(function () { new SimpleSSHConfig(); }, Error);
  });

  it("Should read a simple config file", function() {
    mockSimpleConfigFile();
    
    const config =  new SimpleSSHConfig();

    assert.equal(config.credentials.username, configFileMockSingle.username);
    assert.equal(config.credentials.host, configFileMockSingle.host);
    assert.equal(config.commands[0], configFileMockSingle.commands[0]);
  });

  it("Should read a config file with an array", function() {
    mockArrayConfigFile(); 

    const config =  new SimpleSSHConfig();

    assert.equal(config.credentials.username, configFileMockArray[0].username)
  });

  it("Should read a config file with an array and respect the given key", function() {
    mockArrayConfigFile(); 

    const config =  new SimpleSSHConfig('test-key-2');

    assert.equal(config.credentials.username, configFileMockArray[1].username)
  });

  it("Should read a config file with an array when the given key is wrong", function() {
    mockArrayConfigFile(); 

    const config =  new SimpleSSHConfig('wrong key');

    assert.equal(config.credentials.username, configFileMockArray[0].username)
  });

  it("Should read a config file with an array whne the given key is wrong", function() {
    mockArrayConfigFile(); 

    const config =  new SimpleSSHConfig('test-key-3');

    assert.equal(config.credentials.password, configFileMockArray[2].password)
  });

});

function mockSimpleConfigFile() {
  mock({
    '.simple-ssh-commands': JSON.stringify(configFileMockSingle)
  });
}

function mockArrayConfigFile() {
  mock({
    '.simple-ssh-commands': JSON.stringify(configFileMockArray)
  });
}