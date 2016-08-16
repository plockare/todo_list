'use strict';

let validation = require(CONFIG.module_path + '/validation');
let errorMessages = require(CONFIG.module_path + '/error').messages;
let consts = require('./consts');

let create =
{
	'label': {
		notEmpty: true,
		errorMessage: errorMessages.required
	}
};

let updateState =
{
	'state': {
		notEmpty: true,
		errorMessage: errorMessages.required,
		has: {
			options: [consts.STATE]
		}
	}
};

module.exports.create = validation.checkBody(create);
module.exports.update = validation.checkBody(create);
module.exports.updateState = validation.checkBody(updateState);