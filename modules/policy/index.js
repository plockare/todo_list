var modelManager = require(CONFIG.module_path + '/modelManager');
var errorMessages = require(CONFIG.module_path + '/error').messages;
var authModel = modelManager.getModel(CONFIG.db.tables.access_token);

module.exports.isSignedIn = function (req, res, next) {
	var access_token = req.headers[CONFIG.access_token] || req.query[CONFIG.access_token] || false;
	if (!access_token) {
		return next(new APIError(errorMessages.no_access_token, 400));
	}
	authModel
		.getToken(access_token)
		.then(function (token) {
			if (!token) throw new APIError(errorMessages.unauthorized, 401);
			req.session = token;
			if (req.method == 'PUT') {
				req.body.updated_by_user_id = req.session.user_id;
			} else if (req.method == 'POST') {
				req.body.created_by_user_id = req.session.user_id;
			}
			next();
		})
		.catch(function (e) {
			next(e);
		});
};