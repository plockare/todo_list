var modelManager = require(CONFIG.module_path + '/modelManager');
var errorMessages = require(CONFIG.module_path + '/error').messages;
var authModel;
var userModel;

module.exports.login = function (req, res, next) {
	userModel
		.findByCredentials(req.body.email, req.body.password)
		.then(function (user) {
			if (!user) {
				throw new APIError(errorMessages.invalid_credentials, 400);
			}
			return authModel.createAccessToken(user)
				.then(function (result) {
					return {access_token: result.access_token};
				});
		})
		.then(function (result) {
			res.status(201).json(result);
		})
		.catch(next);
};

module.exports.logout = function (req, res, next) {
	authModel
		.destroy({where: {access_token: req.session.access_token}})
		.then(function () {
			res.sendStatus(204);
		})
		.catch(next);
};

module.exports.init = function () {
	authModel = modelManager.getModel(CONFIG.db.tables.access_token);
	userModel = modelManager.getModel(CONFIG.db.tables.user);
};
