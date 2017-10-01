var exec = require('child_process').exec;

module.exports = function (command, callback) {
	var process = exec(command, function(err, stdout, stderr) {
		callback(err, stdout);
		// todo close terminal
	});
};





