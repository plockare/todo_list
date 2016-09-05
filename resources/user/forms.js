var validation = require(CONFIG.module_path + '/validation');
var errorMessages = require(CONFIG.module_path + '/error').messages;
var register =
{
	'email': {
		notEmpty: true,
		isEmail: {
			errorMessage: errorMessages.email
		},
		errorMessage: errorMessages.required
	},
	'password': {
		notEmpty: true,
		errorMessage: errorMessages.required
	}
};

module.exports.register = validation.checkBody(register);