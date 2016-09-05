var log = require(CONFIG.module_path + '/log');

module.exports = function (app) {

	if (CONFIG.ENV.DEBUG) {
		app.use(function (req, res, next) {
			let payload = req.body;
			req.body && req.body.password && (payload = '{hidden content}');
			log.info("Request to: (" + req.method + ") " + req.url, payload);
			next();
		});
	}

	var resources = require(CONFIG.module_path + '/resources');
	resources.init(app);

	app.use("*", function (req, res) {
		log.warn("Non existing route: (" + req.method + ") " + req.originalUrl);
		res.status(404).send("Route not found.");
	});

	app.use(function (err, req, res, next) {
		log.error("Error", err, err.stack);
		if (typeof err == "number") {
			return res.sendStatus(err);
		} else if (err instanceof APIError) {
			if (err.status != 500) {
				return res.status(err.status).json({error: err.message});
			}
		} else if (err && err.name == 'SequelizeUniqueConstraintError') {
			var e = err.errors.map(function (item) {
				return item.path + '_already_exist';
			});
			return res.status(400).json({error: e});
		} else if (err && err.name == 'SequelizeForeignKeyConstraintError') {
			return res.status(400).json({error: "err_wrong_" + err.index});
		} else {
			return res.status(400).json({error: err});
		}
	});
};
