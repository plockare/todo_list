var modelManager = require(CONFIG.module_path + '/modelManager');
var errorMessages = require(CONFIG.module_path + '/error').messages;
var userModel;

module.exports.register = function (req, res, next) {
	userModel
		.create(req.body)
		.then(function () {
			res.sendStatus(201);
		})
		.catch(next);
};

module.exports.init = function () {
	userModel = modelManager.getModel(CONFIG.db.tables.user);
};
