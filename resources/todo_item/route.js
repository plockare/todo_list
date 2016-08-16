'use strict';

let validation = require(CONFIG.module_path + '/validation');
let policy = require(CONFIG.module_path + '/policy');

module.exports = (app, resource) => {
	app.get(
		CONFIG.uri_segments.todo_item,
		[
			policy.isSignedIn,
			validation.checkListOptions
		],
		resource.controller.list
	);

	app.post(
		CONFIG.uri_segments.todo_item,
		[
			policy.isSignedIn,
			resource.forms.create
		],
		resource.controller.create
	);

	app.put(
		CONFIG.uri_segments.todo_item + '/:id',
		[
			policy.isSignedIn,
			validation.checkId('id'),
			resource.forms.update
		],
		resource.controller.update
	);

	app.get(
		CONFIG.uri_segments.todo_item + '/:id',
		[
			policy.isSignedIn,
			validation.checkId('id')
		],
		resource.controller.detail
	);

	app.delete(
		CONFIG.uri_segments.todo_item + '/:id',
		[
			policy.isSignedIn,
			validation.checkId('id')
		],
		resource.controller.remove
	);

	app.put(
		CONFIG.uri_segments.todo_item + '/:id/state',
		[
			policy.isSignedIn,
			validation.checkId('id'),
			resource.forms.updateState
		],
		resource.controller.updateState
	);

};
