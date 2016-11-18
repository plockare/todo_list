import modelManager from '../../modules/modelManager';
import controllerMethods from '../../modules/controllerMethods';
import APIError, { messages as errorMessages } from '../../modules/error';
import consts from './consts';

const todoItemModel = modelManager.getModel('todo_item');

export function create(req, res, next) {
  req.body.user_id = req.session.user_id;
  return todoItemModel
    .create(req.body)
    .then((item) => {
      res.status(201).json(item);
    })
    .catch(next);
}

export function update(req, res, next) {
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
    .then(() => res.sendStatus(204))
    .catch(next);
}

export function list(req, res, next) {
  return todoItemModel
    .findAndCountAll()
    .then(controllerMethods.decorateResponseAndSend(res, req.query))
    .catch(next);
}

export function detail(req, res, next) {
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
}

export function remove(req, res, next) {
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
    .then(() => res.sendStatus(204))
    .catch(next);
}

export function updateState(req, res, next) {
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

      if (item.completed !== consts.STATE_TRANSITION[req.body.state]) {
        throw new APIError(`err_already_${req.body.state.toLowerCase()}`, 400);
      }

      return item.update({
        completed: !item.completed,
        completed_at: item.completed ? null : modelManager.sequelize.fn('NOW')
      });
    })
    .then(() => res.sendStatus(204))
    .catch(next);
}
