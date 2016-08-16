'use strict';

let fs = require('fs');
let path = require('path');
let log = require(CONFIG.module_path + '/log');

module.exports = {};
module.exports.init = (app) => {
	let folders = fs.readdirSync(CONFIG.resource_path);
	let stat;
	folders.forEach((f) => {
		stat = fs.statSync(path.join(CONFIG.resource_path, f));
		if (stat.isDirectory()) {
			module.exports[f] = {};
			if (fs.existsSync(path.join(CONFIG.resource_path, f, 'controller.js'))) {
				let controller = require(path.join(CONFIG.resource_path, f, 'controller.js'));
				module.exports[f].controller = controller;
				log.info(`Resource ${f} - controller loaded`);
				controller.init && controller.init(app);
			}

			if (fs.existsSync(path.join(CONFIG.resource_path, f, 'forms.js'))) {
				let forms = require(path.join(CONFIG.resource_path, f, 'forms.js'));
				module.exports[f].forms = forms;
				log.info(`Resource ${f} - forms loaded`);
			}

			if (fs.existsSync(path.join(CONFIG.resource_path, f, 'route.js'))) {
				let route = require(path.join(CONFIG.resource_path, f, 'route.js'));
				log.info(`Resource ${f} - route loaded`);
				module.exports[f].route = route(app, module.exports[f]);
			}
		}
	});
};
