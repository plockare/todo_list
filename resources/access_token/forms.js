var validation = require(CONFIG.module_path + '/validation');
var errorMessages = require(CONFIG.module_path + '/error').messages;
var login =
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

module.exports.login = validation.checkBody(login);