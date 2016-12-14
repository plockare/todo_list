import modelManager from '../../modules/modelManager';
const userModel = modelManager.getModel('user');

export default {
  register(req, res, next) {
    req.body.password = userModel.encryptPassword(req.body.password);
    userModel
      .create(req.body)
      .then(() => res.sendStatus(201))
      .catch(next);
  }
};

export function detail(req, res, next) {
  return userModel
      .find({
        where: {
          id: req.params.id,
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
