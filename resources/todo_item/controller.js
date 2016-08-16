'use strict';

let modelManager = require(CONFIG.module_path + '/modelManager');
let controllerMethods = require(CONFIG.module_path + '/controllerMethods');
let errorMessages = require(CONFIG.module_path + '/error').messages;
let consts = require('./consts');
let todoItemModel;
module.exports.init = () => {
	todoItemModel = modelManager.getModel('todo_item');
};

module.exports.create = (req, res, next) => {
	req.body.user_id = req.session.user_id;
	return todoItemModel
		.create(req.body)
		.then((item) => {
			res.status(201).json(item);
		})
		.catch(next);
};

module.exports.update = (req, res, next) => {
	return todoItemModel
		.find({
			where: {
				id: req.params.id,
				user_id: req.session.user_id
			}
		})
		.then(item => {
			if (!item) {
				throw new APIError(errorMessages.not_found, 404);
			}

			return item.update(req.body);
		})
		.then(()=> {
			res.sendStatus(204);
		})
		.catch(next);
};


module.exports.list = (req, res, next) => {
	return todoItemModel
		.findAndCountAll()
		.then(controllerMethods.decorateResponseAndSend(res, req.query))
		.catch(next);
};


module.exports.detail = (req, res, next) => {
	return todoItemModel
		.find({
			where: {
				id: req.params.id,
				user_id: req.session.user_id
			}
		})
		.then(item => {
			if (!item) {
				throw new APIError(errorMessages.not_found, 404);
			}

			res.json(item);
		})
		.catch(next);
};

module.exports.remove = (req, res, next) => {
	return todoItemModel
		.find({
			where: {
				id: req.params.id,
				user_id: req.session.user_id
			}
		})
		.then(item => {
			if (!item) {
				throw new APIError(errorMessages.not_found, 404);
			}

			return item.destroy();
		})
		.then(()=> {
			res.sendStatus(204);
		})
		.catch(next);
};

module.exports.updateState = (req, res, next) => {
	return todoItemModel
		.find({
			where: {
				id: req.params.id,
				user_id: req.session.user_id
			}
		})
		.then(item => {
			if (!item) {
				throw new APIError(errorMessages.not_found, 404);
			}

			if (item.completed != consts.STATE_TRANSITION[req.body.state]) {
				throw new APIError('err_already_' + req.body.state.toLowerCase(), 400);
			}

			return item.update({
				completed: !item.completed,
				completed_at: item.completed ? null : modelManager.sequelize.fn('NOW')
			});
		})
		.then(()=> {
			res.sendStatus(204);
		})
		.catch(next);
};
