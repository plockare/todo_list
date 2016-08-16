var policy = require(CONFIG.module_path + '/policy');

module.exports = function (app, resource) {
	app.post(
		CONFIG.uri_segments.authentication + "/login",
		resource.forms.login,
		resource.controller.login
	);

	app.get(
		CONFIG.uri_segments.authentication + "/logout",
		policy.isSignedIn,
		resource.controller.logout
	);
};