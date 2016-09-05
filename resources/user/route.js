var policy = require(CONFIG.module_path + '/policy');

module.exports = function (app, resource) {
	app.post(
		CONFIG.uri_segments.authentication + "/register",
		resource.forms.register,
		resource.controller.register
	);
};