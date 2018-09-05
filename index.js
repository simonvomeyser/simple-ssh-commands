var colors = require('colors/safe');

try {
    
    var config = require('../../.ssh-commandss')

} catch (error) {

    console.warn(colors.yellow("Simple SSH Commands: You are missing an '.ssh-commands' file in your root directory."));
    
} 

return;
