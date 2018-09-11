var assert = require('assert');
var parsePassword = require('../parsePassword');

describe('Parse Password Function', function() {
    it('Should simple return the password when passed one', function() {
      assert.equal(parsePassword({password: "12345"}), 12345);
    });
    it('Returns nothing when nothing was passed', function() {
      assert.equal(parsePassword(), '');
    });
    it('Returns nothing when nothing but an empty object was passed', function() {
      assert.equal(parsePassword({password: undefined, configKey: undefined}), '');
    });
    it('Returns the env password if the key exists', function() {
      process.env.SSC_PASSWORD = 12345;
      assert.equal(parsePassword(), '12345');
    });    
    it('Returns the env password of the key passed', function() {
      process.env.SSC_PASSWORD_TEST = 12345;
      assert.equal(parsePassword({configKey: 'TEST'}), '12345');
    });
});